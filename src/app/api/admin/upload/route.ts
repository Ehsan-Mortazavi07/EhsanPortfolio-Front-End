import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { SERVER_BASE_API_URL } from "@/common/constants";
import {
  isSafeUploadPathname,
  MAX_UPLOAD_FILE_SIZE,
  uploadContentTypeForFile,
} from "@/common/utils/upload-file";

class UploadRouteError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function parseClientPayload(payload: string | null) {
  if (!payload) throw new UploadRouteError("Invalid upload request", 400);

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    throw new UploadRouteError("Invalid upload request", 400);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new UploadRouteError("Invalid upload request", 400);
  }

  const data = parsed as Record<string, unknown>;
  if (
    typeof data.contentType !== "string" ||
    typeof data.size !== "number" ||
    !Number.isInteger(data.size) ||
    data.size < 0 ||
    data.size > MAX_UPLOAD_FILE_SIZE
  ) {
    throw new UploadRouteError("Invalid upload request", 400);
  }

  return { contentType: data.contentType, size: data.size };
}

async function assertAdminAccess(request: NextRequest): Promise<void> {
  const token = request.cookies.get("token")?.value;
  if (!token) throw new UploadRouteError("Not authenticated", 401);

  let response: Response;
  try {
    response = await fetch(`${SERVER_BASE_API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    throw new UploadRouteError("Upload service is temporarily unavailable", 503);
  }

  if (response.status === 401 || response.status === 403) {
    throw new UploadRouteError("You do not have permission to upload files", response.status);
  }
  if (!response.ok) {
    throw new UploadRouteError("Upload service is temporarily unavailable", 503);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ message: "Invalid request origin" }, { status: 403 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ message: "Invalid upload request" }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isSafeUploadPathname(pathname)) {
          throw new UploadRouteError("File format is not allowed", 400);
        }

        const { contentType } = parseClientPayload(clientPayload);
        const allowedContentType = uploadContentTypeForFile(pathname, contentType);
        if (!allowedContentType) {
          throw new UploadRouteError("File format is not allowed", 400);
        }

        await assertAdminAccess(request);

        return {
          allowedContentTypes: [allowedContentType],
          maximumSizeInBytes: MAX_UPLOAD_FILE_SIZE,
          validUntil: Date.now() + 10 * 60 * 1000,
          addRandomSuffix: false,
          allowOverwrite: false,
          cacheControlMaxAge: 30 * 24 * 60 * 60,
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = error instanceof UploadRouteError ? error.status : 500;
    return NextResponse.json({ message }, { status });
  }
}

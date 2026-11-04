import { axiosInstance } from "@/common/axiosInstance";
import { upload } from "@vercel/blob/client";
import type { AdminDashboardStats } from "@/common/interfaces";
import {
  MAX_UPLOAD_FILE_SIZE,
  uploadContentTypeForFile,
} from "@/common/utils/upload-file";

function authHeader(token: string | null) {
  return { Authorization: `Bearer ${token}` };
}

export type AdminListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
};

export async function adminList<T>(
  token: string | null,
  path: string,
  params?: AdminListParams,
): Promise<{ items: T[]; total: number; page: number; pageSize: number }> {
  const res = await axiosInstance.get(path, {
    headers: authHeader(token),
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      ...(params?.q?.trim() ? { q: params.q.trim() } : {}),
      ...(params?.status ? { status: params.status } : {}),
    },
  });
  return res.data;
}

export async function adminGet<T>(token: string | null, path: string): Promise<T> {
  const res = await axiosInstance.get(path, { headers: authHeader(token) });
  return res.data;
}

export async function adminCreate<T>(token: string | null, path: string, body: unknown): Promise<T> {
  const res = await axiosInstance.post(path, body, { headers: authHeader(token) });
  return res.data;
}

export async function adminUpdate<T>(token: string | null, path: string, body: unknown): Promise<T> {
  const res = await axiosInstance.patch(path, body, { headers: authHeader(token) });
  return res.data;
}

export async function adminDelete<T>(token: string | null, path: string): Promise<T> {
  const res = await axiosInstance.delete(path, { headers: authHeader(token) });
  return res.data;
}

export async function adminUploadImage(
  token: string | null,
  file: File,
): Promise<{ path: string }> {
  if (process.env.NODE_ENV === "production") {
    if (!token) throw new Error("Not authenticated");

    const contentType = uploadContentTypeForFile(file.name, file.type);
    if (!contentType) throw new Error("File format is not allowed");
    if (file.size > MAX_UPLOAD_FILE_SIZE) throw new Error("File is too large");

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const pathname = `uploads/${crypto.randomUUID()}${extension}`;
    const blob = await upload(pathname, file, {
      access: "public",
      contentType,
      handleUploadUrl: "/api/admin/upload",
      clientPayload: JSON.stringify({ contentType, size: file.size }),
      multipart: file.size > 5 * 1024 * 1024,
    });

    return { path: blob.url };
  }

  const body = new FormData();
  body.append("file", file);
  const res = await axiosInstance.post<{ path: string }>("/admin/upload", body, {
    headers: authHeader(token),
    maxBodyLength: 15 * 1024 * 1024,
    maxContentLength: 15 * 1024 * 1024,
  });
  return res.data;
}

export async function adminDashboardStats(token: string | null): Promise<AdminDashboardStats> {
  return adminGet<AdminDashboardStats>(token, "/admin/dashboard/stats");
}

export async function adminUpdateSiteSettings(
  token: string | null,
  body: unknown,
): Promise<unknown> {
  const res = await axiosInstance.put("/admin/site-settings", body, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function adminGetSiteSettings(token: string | null): Promise<unknown> {
  return adminGet(token, "/admin/site-settings");
}

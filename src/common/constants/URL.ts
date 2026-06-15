function stripV1Path(base: string): string {
  return base.replace(/\/v1\/?$/, "");
}

const defaultApi = "http://localhost:7781/v1";

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || defaultApi;

export const SERVER_BASE_API_URL = process.env.INTERNAL_API_URL?.trim() || BASE_API_URL;

export const IMAGE_BASE_API_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.trim() || stripV1Path(BASE_API_URL);

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:7070";

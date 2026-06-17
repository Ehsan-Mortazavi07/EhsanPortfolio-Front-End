function stripV1Path(base: string): string {
  return base.replace(/\/v1\/?$/, "");
}

const PRODUCTION_API_URL = "https://api.ehsanmor.ir/v1";
const PRODUCTION_IMAGE_BASE_URL = "https://api.ehsanmor.ir";
const defaultApi = "http://localhost:7781/v1";

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : defaultApi);

export const SERVER_BASE_API_URL = process.env.INTERNAL_API_URL?.trim() || BASE_API_URL;

export const IMAGE_BASE_API_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.trim() ||
  stripV1Path(BASE_API_URL) ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_IMAGE_BASE_URL : "http://localhost:7781");

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.NODE_ENV === "production" ? "https://ehsanmor.ir" : "http://localhost:7070");

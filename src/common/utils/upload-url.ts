import { IMAGE_BASE_API_URL } from "@/common/constants";

/** Paths served from Next.js `public/` (not the API uploads volume). */
const FRONTEND_ASSET_PREFIXES = ["/images/", "/cv/"];

/** Default seed assets ship with the API repo under `public/uploads/seed/`. */
const LEGACY_SEED_UPLOAD_PATHS: Record<string, string> = {
  "/uploads/projects/portfolio.jpg": "/uploads/seed/projects/portfolio.jpg",
  "/uploads/projects/ecommerce.jpg": "/uploads/seed/projects/ecommerce.jpg",
  "/uploads/projects/dashboard.jpg": "/uploads/seed/projects/dashboard.jpg",
  "/uploads/articles/nestjs.jpg": "/uploads/seed/articles/nestjs.jpg",
  "/uploads/articles/react.jpg": "/uploads/seed/articles/react.jpg",
  "/uploads/cv.pdf": "/uploads/seed/cv.pdf",
  "/uploads/og-image.jpg": "/uploads/seed/og-image.jpg",
};

export const DEFAULT_IMAGE_FALLBACK = "/images/hero/thumb-plant.svg";

function normalizeUploadPath(path: string): string {
  return LEGACY_SEED_UPLOAD_PATHS[path] ?? path;
}

export function resolvePublicUploadUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (FRONTEND_ASSET_PREFIXES.some((prefix) => path.startsWith(prefix))) return path;
  const normalized = normalizeUploadPath(path);
  if (normalized.startsWith("/")) return `${IMAGE_BASE_API_URL}${normalized}`;
  return `${IMAGE_BASE_API_URL}/${normalized}`;
}

/** Icon / image reference: uploaded path, site asset, or external URL. */
export function resolveIconSrc(icon: string | null | undefined): string | null {
  if (!icon?.trim()) return null;
  const value = icon.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/") || value.startsWith("uploads/")) {
    return resolvePublicUploadUrl(value.startsWith("/") ? value : `/${value}`);
  }
  return null;
}

export function isExternalIconSrc(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

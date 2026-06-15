import { IMAGE_BASE_API_URL } from "@/common/constants";

/** Paths served from Next.js `public/` (not the API uploads volume). */
const FRONTEND_ASSET_PREFIXES = ["/images/", "/cv/"];

export function resolvePublicUploadUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (FRONTEND_ASSET_PREFIXES.some((prefix) => path.startsWith(prefix))) return path;
  if (path.startsWith("/")) return `${IMAGE_BASE_API_URL}${path}`;
  return `${IMAGE_BASE_API_URL}/${path}`;
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

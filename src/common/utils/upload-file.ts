const CONTENT_TYPES_BY_EXTENSION: Record<string, readonly string[]> = {
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".gif": ["image/gif"],
  ".webp": ["image/webp"],
  ".avif": ["image/avif"],
  ".heic": ["image/heic"],
  ".heif": ["image/heif"],
  ".svg": ["image/svg+xml"],
  ".ico": ["image/x-icon", "image/vnd.microsoft.icon"],
  ".pdf": ["application/pdf"],
};

export const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024;

export function uploadContentTypeForFile(
  filename: string,
  claimedContentType: string,
): string | null {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  const allowedContentTypes = CONTENT_TYPES_BY_EXTENSION[extension];
  if (!allowedContentTypes) return null;

  const normalizedType = claimedContentType.trim().toLowerCase();
  if (!normalizedType || normalizedType === "application/octet-stream") {
    return extension === ".pdf" ? "application/pdf" : allowedContentTypes[0];
  }

  return allowedContentTypes.includes(normalizedType) ? normalizedType : null;
}

export function isSafeUploadPathname(pathname: string): boolean {
  const match = /^uploads\/[a-z0-9_-]+(\.[a-z0-9]+)$/i.exec(pathname);
  return Boolean(match && CONTENT_TYPES_BY_EXTENSION[match[1].toLowerCase()]);
}

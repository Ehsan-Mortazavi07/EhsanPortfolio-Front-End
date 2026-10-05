"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { adminUploadImage } from "@/common/api/admin";
import { useTranslation } from "@/common/i18n/useTranslation";
import { parseApiError, resolvePublicUploadUrl } from "@/common/utils";
import { toast } from "@/common/utils/toast";

type Props = {
  value: string[];
  onChange: (paths: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
  token: string | null;
};

export function AdminImageGalleryField({ value, onChange, onUploadingChange, token }: Props) {
  const { t, locale } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    if (!token) {
      toast.error(t("admin.notAuthenticated"));
      return;
    }

    setUploading(true);
    onUploadingChange(true);
    const uploaded: string[] = [];
    let uploadError: unknown;

    try {
      for (const file of Array.from(files)) {
        try {
          const result = await adminUploadImage(token, file);
          uploaded.push(result.path);
        } catch (error) {
          uploadError = error;
          break;
        }
      }

      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
        toast.success(t("admin.galleryImagesUploaded"));
      }
      if (uploadError) {
        toast.error(parseApiError(uploadError, locale).message || t("admin.uploadFailed"));
      }
    } finally {
      setUploading(false);
      onUploadingChange(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((path, index) => {
            const preview = resolvePublicUploadUrl(path);
            return (
              <div key={`${path}-${index}`} className="space-y-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-secondary ring-1 ring-border/50">
                  {preview ? <Image src={preview} alt="" fill className="object-contain" unoptimized /> : null}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  isDisabled={uploading}
                  onPress={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
                  aria-label={`${t("admin.remove")} ${index + 1}`}
                >
                  {t("admin.remove")}
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label={t("admin.projectGallery")}
        onChange={(event) => void onFilesSelected(event.currentTarget.files)}
      />
      <Button
        size="sm"
        variant="secondary"
        isDisabled={uploading}
        isPending={uploading}
        onPress={() => inputRef.current?.click()}
      >
        {t("admin.upload")}
      </Button>
    </div>
  );
}

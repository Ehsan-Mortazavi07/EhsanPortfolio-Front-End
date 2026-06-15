"use client";

import { Button, Label } from "@heroui/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { adminUploadImage } from "@/common/api/admin";
import { useTranslation } from "@/common/i18n/useTranslation";
import { parseApiError, resolvePublicUploadUrl } from "@/common/utils";
import { toast } from "@/common/utils/toast";

type Props = {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
  token: string | null;
};

export function AdminImageField({ label, value, onChange, token }: Props) {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const preview = resolvePublicUploadUrl(value);

  async function onFile(file: File) {
    if (!token) return toast.error(t("admin.notAuthenticated"));
    setUploading(true);
    try {
      const { path } = await adminUploadImage(token, file);
      onChange(path);
      toast.success(t("admin.imageUploaded"));
    } catch (err) {
      toast.error(parseApiError(err).message || t("admin.uploadFailed"));
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{label}</Label>
      {preview && (
        <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-xl ring-1 ring-border/50">
          <Image src={preview} alt="" fill className="object-cover" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        <Button
          size="sm"
          variant="secondary"
          isDisabled={uploading}
          isPending={uploading}
          onPress={() => ref.current?.click()}
        >
          {t("admin.upload")}
        </Button>
        {value && (
          <Button size="sm" variant="ghost" onPress={() => onChange(null)}>
            {t("admin.remove")}
          </Button>
        )}
      </div>
    </div>
  );
}

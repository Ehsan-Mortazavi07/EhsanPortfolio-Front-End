"use client";

import { Button, Input, Label, TextField } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { adminUploadImage } from "@/common/api/admin";
import { useTranslation } from "@/common/i18n/useTranslation";
import { parseApiError, resolveIconSrc } from "@/common/utils";
import { toast } from "@/common/utils/toast";

const ICON_ACCEPT =
  "image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml,image/avif,image/x-icon,.png,.jpg,.jpeg,.webp,.gif,.svg,.avif,.ico";

type Props = {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
  token: string | null;
};

export function AdminIconField({ label, value, onChange, token }: Props) {
  const { t } = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState(value ?? "");
  const preview = resolveIconSrc(value);

  useEffect(() => {
    setUrlDraft(value ?? "");
  }, [value]);

  async function onFile(file: File) {
    if (!token) return toast.error(t("admin.notAuthenticated"));
    setUploading(true);
    try {
      const { path } = await adminUploadImage(token, file);
      onChange(path);
      setUrlDraft(path);
      toast.success(t("admin.imageUploaded"));
    } catch (err) {
      toast.error(parseApiError(err).message || t("admin.uploadFailed"));
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">{label}</Label>

      {preview && (
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-surface-secondary ring-1 ring-border/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="max-h-16 max-w-16 object-contain" />
        </div>
      )}

      <TextField
        value={urlDraft}
        variant="secondary"
        fullWidth
        onChange={(v) => {
          const next = String(v ?? "");
          setUrlDraft(next);
          onChange(next.trim() || null);
        }}
      >
        <Label className="text-sm font-semibold">{t("admin.iconUrl")}</Label>
        <Input placeholder={t("admin.iconUrlPlaceholder")} />
      </TextField>
      <p className="text-xs text-foreground/55">{t("admin.iconUrlHint")}</p>

      <div className="flex flex-wrap gap-2">
        <input
          ref={ref}
          type="file"
          accept={ICON_ACCEPT}
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
          <Button
            size="sm"
            variant="ghost"
            onPress={() => {
              onChange(null);
              setUrlDraft("");
            }}
          >
            {t("admin.remove")}
          </Button>
        )}
      </div>
    </div>
  );
}

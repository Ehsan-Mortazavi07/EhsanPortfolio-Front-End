"use client";

import { useTranslation } from "@/common/i18n/useTranslation";
import { AdminCheckboxField } from "@/components/admin/AdminCheckboxField";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
};

export function AdminPublishedField({ checked, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--tag-bg)] p-4 space-y-3">
      <AdminCheckboxField label={t("admin.published")} checked={checked} onChange={onChange} />
      <p className="text-xs text-foreground/55 ps-7">{t("admin.publishedHint")}</p>
    </div>
  );
}

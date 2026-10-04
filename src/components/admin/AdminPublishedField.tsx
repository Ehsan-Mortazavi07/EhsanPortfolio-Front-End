"use client";

import { useTranslation } from "@/common/i18n/useTranslation";
import { AdminCheckboxField } from "@/components/admin/AdminCheckboxField";
import type { MessageKey } from "@/common/i18n";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  labelKey?: MessageKey;
  hintKey?: MessageKey;
};

export function AdminPublishedField({ checked, onChange, labelKey = "admin.published", hintKey = "admin.publishedHint" }: Props) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--tag-bg)] p-4 space-y-3">
      <AdminCheckboxField label={t(labelKey)} checked={checked} onChange={onChange} />
      <p className="text-xs text-foreground/55 ps-7">{t(hintKey)}</p>
    </div>
  );
}

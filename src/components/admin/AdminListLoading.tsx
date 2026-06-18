"use client";

import { Spinner } from "@heroui/react";
import { useTranslation } from "@/common/i18n/useTranslation";

export function AdminListLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[12rem] items-center justify-center gap-2 py-12">
      <Spinner size="sm" />
      <span className="text-sm text-foreground/60">{t("admin.loading")}</span>
    </div>
  );
}

"use client";

import { Button, SearchField } from "@heroui/react";
import { SearchNormal1 } from "iconsax-reactjs";
import { useTranslation } from "@/common/i18n/useTranslation";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder?: string;
  page: number;
  pageSize: number;
  total: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
};

export function AdminListToolbar({
  query,
  onQueryChange,
  searchPlaceholder,
  page,
  pageSize,
  total,
  loading,
  onPageChange,
}: Props) {
  const { t } = useTranslation();
  const placeholder = searchPlaceholder ?? t("admin.search");
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <SearchField aria-label={placeholder} fullWidth variant="secondary" value={query} onChange={onQueryChange} className="sm:max-w-md">
        <SearchField.Group className="flex h-11 items-center gap-2 rounded-xl bg-surface px-3 ring-1 ring-border/50">
          <SearchNormal1 size={16} className="text-foreground/50" />
          <SearchField.Input placeholder={placeholder} className="min-w-0 flex-1 text-sm" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <div className="flex items-center gap-3">
        <p className="text-xs font-medium text-foreground/55">{loading ? t("admin.loading") : `${from}–${to} / ${total}`}</p>
        <Button size="sm" variant="secondary" isDisabled={page <= 1 || loading} onPress={() => onPageChange(page - 1)}>
          {t("admin.prev")}
        </Button>
        <Button size="sm" variant="secondary" isDisabled={page >= lastPage || loading} onPress={() => onPageChange(page + 1)}>
          {t("admin.next")}
        </Button>
      </div>
    </div>
  );
}

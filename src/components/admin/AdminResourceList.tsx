"use client";

import { Button, Card, Link } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminDelete, adminUpdate } from "@/common/api/admin";
import { parseApiError } from "@/common/utils/api-error";
import { lt } from "@/common/utils/localized";
import { formatAdminDate } from "@/common/utils/format-date";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { MessageKey } from "@/common/i18n";
import { toast } from "@/common/utils/toast";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";
import { AdminCheckboxField } from "@/components/admin/AdminCheckboxField";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminListLoading } from "@/components/admin/AdminListLoading";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { useAdminList } from "@/components/admin/useAdminList";

type SlugItem = {
  slug: string;
  id?: string;
  title?: string;
  titleFa?: string;
  name?: string;
  nameFa?: string;
  category?: string;
  company?: string;
  companyFa?: string;
  role?: string;
  roleFa?: string;
  subject?: string;
  published?: boolean;
  createdAt?: string | null;
};

type Props = {
  title: string;
  description?: string;
  apiPath: string;
  newPath: string;
  editPath: (slug: string) => string;
  labelFields: { en: keyof SlugItem; fa?: keyof SlugItem };
  secondaryFields?: { en: keyof SlugItem; fa?: keyof SlugItem };
  showSlug?: boolean;
  showPublished?: boolean;
  publicationLabelKey?: "admin.published" | "admin.approveToPublish";
};

const categoryLabels: Record<string, MessageKey> = {
  frontend: "admin.category.frontend",
  backend: "admin.category.backend",
  devops: "admin.category.devops",
  database: "admin.category.database",
  language: "admin.category.language",
};

export function AdminResourceList({
  title,
  description,
  apiPath,
  newPath,
  editPath,
  labelFields,
  secondaryFields,
  showSlug = true,
  showPublished = true,
  publicationLabelKey = "admin.published",
}: Props) {
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const { t, locale } = useTranslation();
  const { items, total, page, setPage, q, setQ, loading, reload, pageSize } = useAdminList<SlugItem>(apiPath);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  async function onDelete(slug: string) {
    if (!token || deletingSlug) return;
    setDeletingSlug(slug);
    try {
      await adminDelete(token, `${apiPath}/${slug}`);
      toast.success(t("admin.delete"));
      setConfirmSlug(null);
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.deleteFailed"));
    } finally {
      setDeletingSlug(null);
    }
  }

  async function onTogglePublished(item: SlugItem, next: boolean) {
    if (!token) return;
    setTogglingSlug(item.slug);
    try {
      await adminUpdate(token, `${apiPath}/${item.slug}`, { published: next });
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.updateFailed"));
    } finally {
      setTogglingSlug(null);
    }
  }

  function readLocalizedField(item: SlugItem, fields: { en: keyof SlugItem; fa?: keyof SlugItem }) {
    const en = item[fields.en];
    const fa = fields.fa ? item[fields.fa] : undefined;
    return lt(locale, typeof en === "string" ? en : "", typeof fa === "string" ? fa : "");
  }

  function isIdentifier(value: string, item: SlugItem) {
    return value === item.slug || value === item.id || /^[\da-f]{24}$/i.test(value);
  }

  function getLabel(item: SlugItem) {
    const value = readLocalizedField(item, labelFields).trim();
    return !value || isIdentifier(value, item) ? t("admin.untitledItem") : value;
  }

  function getSecondaryLabel(item: SlugItem) {
    if (!secondaryFields) return "";
    const value = readLocalizedField(item, secondaryFields);
    const categoryKey = secondaryFields.en === "category" ? categoryLabels[value.toLowerCase()] : undefined;
    return categoryKey ? t(categoryKey) : value;
  }

  return (
    <section className="space-y-6">
      <AdminConfirmDialog
        isOpen={confirmSlug !== null}
        onOpenChange={(open) => { if (!open) setConfirmSlug(null); }}
        title={t("admin.confirmTitle")}
        message={t("admin.deleteConfirm")}
        confirmLabel={t("admin.delete")}
        isPending={deletingSlug !== null}
        onConfirm={() => { if (confirmSlug) void onDelete(confirmSlug); }}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {description && description !== title ? (
            <p className="mt-1 text-sm text-foreground/60">{description}</p>
          ) : null}
        </div>
        <Button variant="primary" className="font-semibold" onPress={() => router.push(newPath)}>
          {t("admin.addNew")}
        </Button>
      </div>

      <AdminListToolbar
        query={q}
        onQueryChange={setQ}
        page={page}
        pageSize={pageSize}
        total={total}
        loading={loading}
        onPageChange={setPage}
      />

      {loading ? (
        <AdminListLoading />
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-border/50 bg-surface-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("common.name")}</th>
                {showSlug ? <th className="px-4 py-3 font-semibold">{t("common.slug")}</th> : null}
                <th className="px-4 py-3 font-semibold">{t("admin.dateAdded")}</th>
                <th className="px-4 py-3 font-semibold text-end">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug} className="border-b border-border/30 align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{getLabel(item)}</div>
                    {secondaryFields ? (
                      <p className="mt-1 text-xs text-foreground/55">{getSecondaryLabel(item)}</p>
                    ) : null}
                    {showPublished ? (
                      <div
                        className={`mt-2.5 inline-flex max-w-full rounded-lg border border-border/40 bg-surface-secondary/60 px-2.5 py-1.5 ${
                          togglingSlug === item.slug ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        <AdminCheckboxField
                          label={t(
                            publicationLabelKey === "admin.published"
                              ? publicationLabelKey
                              : item.published
                                ? "admin.approvedForDisplay"
                                : publicationLabelKey,
                          )}
                          checked={item.published !== false}
                          onChange={(next) => void onTogglePublished(item, next)}
                          className="text-xs [&_[data-slot=content]]:font-normal [&_[data-slot=content]]:text-foreground/70"
                        />
                      </div>
                    ) : null}
                  </td>
                  {showSlug ? <td className="px-4 py-3 text-foreground/60">{item.slug}</td> : null}
                  <td className="whitespace-nowrap px-4 py-3 text-foreground/60">
                    {formatAdminDate(item.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-2">
                      <Link className="text-sm font-semibold" onPress={() => router.push(editPath(item.slug))}>
                        {t("admin.edit")}
                      </Link>
                      <Button size="sm" variant="ghost" className="text-danger" onPress={() => setConfirmSlug(item.slug)}>
                        {t("admin.delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && items.length === 0 && (
        <Card className="rounded-2xl p-8 text-center ring-1 ring-border/50">
          <p className="text-sm text-foreground/60">{t("admin.noItems")}</p>
        </Card>
      )}
    </section>
  );
}

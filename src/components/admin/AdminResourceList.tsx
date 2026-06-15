"use client";

import { Button, Card, Link, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { adminDelete } from "@/common/api/admin";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { toast } from "@/common/utils/toast";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { useAdminList } from "@/components/admin/useAdminList";

type SlugItem = { slug: string; title?: string; name?: string; company?: string; subject?: string };

type Props = {
  title: string;
  description: string;
  apiPath: string;
  newPath: string;
  editPath: (slug: string) => string;
  labelKey?: keyof SlugItem;
};

export function AdminResourceList({
  title,
  description,
  apiPath,
  newPath,
  editPath,
  labelKey = "title",
}: Props) {
  const token = useAppSelector(tokenSelector);
  const router = useRouter();
  const { t } = useTranslation();
  const { items, total, page, setPage, q, setQ, loading, reload, pageSize } = useAdminList<SlugItem>(apiPath);

  async function onDelete(slug: string) {
    if (!token || !confirm(t("admin.deleteConfirm"))) return;
    try {
      await adminDelete(token, `${apiPath}/${slug}`);
      toast.success(t("admin.delete"));
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("admin.deleteFailed"));
    }
  }

  function getLabel(item: SlugItem) {
    const v = item[labelKey];
    return (typeof v === "string" && v) || item.slug;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-foreground/60">{description}</p>
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
        <div className="flex items-center gap-2 py-12">
          <Spinner size="sm" />
          <span className="text-sm text-foreground/60">{t("admin.loading")}</span>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-border/50 bg-surface-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("common.name")}</th>
                <th className="px-4 py-3 font-semibold">{t("common.slug")}</th>
                <th className="px-4 py-3 font-semibold text-end">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug} className="border-b border-border/30">
                  <td className="px-4 py-3 font-medium">{getLabel(item)}</td>
                  <td className="px-4 py-3 text-foreground/60">{item.slug}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex justify-end gap-2">
                      <Link className="text-sm font-semibold" onPress={() => router.push(editPath(item.slug))}>
                        {t("admin.edit")}
                      </Link>
                      <Button size="sm" variant="ghost" className="text-danger" onPress={() => void onDelete(item.slug)}>
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

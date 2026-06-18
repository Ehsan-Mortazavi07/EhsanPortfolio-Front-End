"use client";

import { Button, Card } from "@heroui/react";
import { adminDelete } from "@/common/api/admin";
import type { ContactMessageDto } from "@/common/interfaces";
import { formatAdminDate } from "@/common/utils/format-date";
import { useTranslation } from "@/common/i18n/useTranslation";
import { toast } from "@/common/utils/toast";
import { AdminListLoading } from "@/components/admin/AdminListLoading";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { useAdminList } from "@/components/admin/useAdminList";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

export default function Page() {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const { items, total, page, setPage, q, setQ, loading, reload, pageSize } =
    useAdminList<ContactMessageDto>("/admin/contact-messages");

  async function onDelete(id: string) {
    if (!token || !confirm(t("admin.deleteConfirm"))) return;
    try {
      await adminDelete(token, `/admin/contact-messages/${id}`);
      toast.success(t("admin.delete"));
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("admin.deleteFailed"));
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t("admin.messages")}</h1>
        <p className="mt-1 text-sm text-foreground/60">{t("admin.messagesSubtitle")}</p>
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
        <div className="space-y-4">
          {items.map((msg) => (
            <Card key={msg.id} className="rounded-2xl p-5 ring-1 ring-border/50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {msg.name} · {msg.email}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {t("admin.dateAdded")}: {formatAdminDate(msg.createdAt, locale)}
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="text-danger" onPress={() => void onDelete(msg.id)}>
                  {t("admin.delete")}
                </Button>
              </div>
              <p className="mt-3 font-medium">{msg.subject}</p>
              <p className="mt-2 text-sm text-foreground/70">{msg.message}</p>
            </Card>
          ))}
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

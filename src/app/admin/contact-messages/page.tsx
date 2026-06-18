"use client";

import { Button, Card } from "@heroui/react";
import { useEffect, useState } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { items, total, page, setPage, q, setQ, loading, reload, pageSize } =
    useAdminList<ContactMessageDto>("/admin/contact-messages");

  const selected = items.find((msg) => msg.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedId && !items.some((item) => item.id === selectedId)) {
      setSelectedId(null);
    }
  }, [items, selectedId]);

  async function onDelete(id: string) {
    if (!token || !confirm(t("admin.deleteConfirm"))) return;
    try {
      await adminDelete(token, `/admin/contact-messages/${id}`);
      toast.success(t("admin.delete"));
      if (selectedId === id) setSelectedId(null);
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
      ) : items.length === 0 ? (
        <Card className="rounded-2xl p-8 text-center ring-1 ring-border/50">
          <p className="text-sm text-foreground/60">{t("admin.noItems")}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="admin-table-wrap">
            <table className="w-full text-start text-sm">
              <thead className="border-b border-border/50 bg-surface-secondary">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("common.name")}</th>
                  <th className="px-4 py-3 font-semibold">{t("auth.email")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.messageSubject")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.dateAdded")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((msg) => {
                  const isSelected = selectedId === msg.id;
                  return (
                    <tr
                      key={msg.id}
                      className={`cursor-pointer border-b border-border/30 transition-colors hover:bg-surface-secondary/70 ${
                        isSelected ? "bg-surface-secondary" : ""
                      }`}
                      onClick={() => setSelectedId(isSelected ? null : msg.id)}
                    >
                      <td className="px-4 py-3 font-medium">{msg.name}</td>
                      <td className="px-4 py-3 text-foreground/70">{msg.email}</td>
                      <td className="px-4 py-3">{msg.subject || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-foreground/60">
                        {formatAdminDate(msg.createdAt, locale)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selected ? (
            <Card className="rounded-2xl p-5 ring-1 ring-border/50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                    {t("admin.messageDetail")}
                  </p>
                  <p className="mt-2 font-semibold">
                    {selected.name} · {selected.email}
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    {t("admin.dateAdded")}: {formatAdminDate(selected.createdAt, locale)}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger"
                  onPress={() => void onDelete(selected.id)}
                >
                  {t("admin.delete")}
                </Button>
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground/80">{t("admin.messageSubject")}</p>
              <p className="mt-1 font-medium">{selected.subject || "—"}</p>
              <p className="mt-4 text-sm font-semibold text-foreground/80">{t("admin.messageBody")}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/75">
                {selected.message}
              </p>
            </Card>
          ) : (
            <Card className="rounded-2xl p-6 text-center ring-1 ring-border/40">
              <p className="text-sm text-foreground/55">{t("admin.selectMessage")}</p>
            </Card>
          )}
        </div>
      )}
    </section>
  );
}

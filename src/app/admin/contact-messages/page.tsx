"use client";

import { Button, Card, Modal, useOverlayState } from "@heroui/react";
import { useEffect, useState } from "react";
import { adminDelete, adminUpdate } from "@/common/api/admin";
import type { ContactMessageDto } from "@/common/interfaces";
import { formatAdminDate } from "@/common/utils/format-date";
import { parseApiError } from "@/common/utils/api-error";
import { useTranslation } from "@/common/i18n/useTranslation";
import { toast } from "@/common/utils/toast";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminListLoading } from "@/components/admin/AdminListLoading";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { useAdminList } from "@/components/admin/useAdminList";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

export default function Page() {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const { items, total, page, setPage, q, setQ, loading, reload, pageSize } =
    useAdminList<ContactMessageDto>("/admin/contact-messages");
  const selected = items.find((msg) => msg.id === selectedId) ?? null;
  const messageModal = useOverlayState({
    isOpen: selected !== null,
    onOpenChange: (open) => { if (!open) setSelectedId(null); },
  });

  useEffect(() => {
    if (selectedId && !items.some((item) => item.id === selectedId)) setSelectedId(null);
  }, [items, selectedId]);

  async function openMessage(message: ContactMessageDto) {
    setSelectedId(message.id);
    if (!token || message.read) return;
    try {
      await adminUpdate(token, `/admin/contact-messages/${message.id}/read`, {});
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message);
    }
  }

  async function deleteMessage(id: string) {
    if (!token || deleting) return;
    setDeleting(true);
    try {
      await adminDelete(token, `/admin/contact-messages/${id}`);
      toast.success(t("admin.delete"));
      setConfirmDeleteId(null);
      setSelectedId(null);
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.deleteFailed"));
    } finally {
      setDeleting(false);
    }
  }

  async function setMessagePublished(message: ContactMessageDto, published: boolean) {
    if (!token || publishingId) return;
    setPublishingId(message.id);
    try {
      await adminUpdate(token, `/admin/contact-messages/${message.id}/publication`, { published });
      toast.success(t(published ? "admin.messageApproved" : "admin.messageApprovalRemoved"));
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message);
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <section className="space-y-6">
      <AdminConfirmDialog
        isOpen={confirmDeleteId !== null}
        onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}
        title={t("admin.confirmTitle")}
        message={t("admin.confirmDeleteMessage")}
        confirmLabel={t("admin.delete")}
        isPending={deleting}
        onConfirm={() => { if (confirmDeleteId) void deleteMessage(confirmDeleteId); }}
      />

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
        <div className="admin-table-wrap">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-border/50 bg-surface-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("common.name")}</th>
                <th className="px-4 py-3 font-semibold">{t("auth.email")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.messageSubject")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.userStatusLabel")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.messagePublication")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.dateAdded")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((msg) => (
                <tr
                  key={msg.id}
                  className="cursor-pointer border-b border-border/30 transition-colors hover:bg-surface-secondary/70 focus-within:bg-surface-secondary/70"
                  tabIndex={0}
                  role="button"
                  aria-label={`${msg.name} · ${msg.subject || t("admin.messageSubject")}`}
                  onClick={() => void openMessage(msg)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      void openMessage(msg);
                    }
                  }}
                >
                  <td className="px-4 py-3 font-medium">
                    <button className="text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus" onClick={(event) => { event.stopPropagation(); void openMessage(msg); }}>
                      {msg.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{msg.email}</td>
                  <td className="px-4 py-3">{msg.subject || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`admin-user-status ${msg.read ? "admin-user-status--approved" : "admin-user-status--pending"}`}>
                      {t(msg.read ? "admin.messageRead" : "admin.messageUnread")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`admin-user-status ${msg.published ? "admin-user-status--approved" : "admin-user-status--pending"}`}>
                      {t(msg.published ? "admin.approvedForDisplay" : "admin.pendingApproval")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground/60">{formatAdminDate(msg.createdAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal state={messageModal}>
        <Modal.Backdrop className="bg-black/65 backdrop-blur-sm">
          <Modal.Container size="lg" placement="center" scroll="inside">
            <Modal.Dialog className="admin-message-dialog">
              {selected ? (
                <>
                  <Modal.Header className="flex items-start justify-between gap-4">
                    <div>
                      <Modal.Heading>{t("admin.messageDetail")}</Modal.Heading>
                      <p className="mt-2 text-sm text-foreground/65">{selected.name} · {selected.email}</p>
                      <p className="mt-1 text-xs text-foreground/50">{t("admin.dateAdded")}: {formatAdminDate(selected.createdAt, locale)}</p>
                    </div>
                    <span className={`admin-user-status ${selected.published ? "admin-user-status--approved" : "admin-user-status--pending"}`}>
                      {t(selected.published ? "admin.approvedForDisplay" : "admin.pendingApproval")}
                    </span>
                  </Modal.Header>
                  <Modal.Body className="space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground/70">{t("admin.messageSubject")}</h3>
                      <p className="rounded-xl bg-surface-secondary p-4 font-medium">{selected.subject || "—"}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground/70">{t("admin.messageBody")}</h3>
                      <p className="min-h-28 whitespace-pre-wrap rounded-xl bg-surface-secondary p-4 text-sm leading-7">{selected.message}</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground/70">{t("admin.messagePublication")}</h3>
                      <p className="rounded-xl bg-surface-secondary p-4 text-sm">
                        {t(selected.allowPublicDisplay ? "admin.publicDisplayConsentGiven" : "admin.publicDisplayConsentMissing")}
                      </p>
                      {!selected.allowPublicDisplay ? (
                        <p className="text-xs leading-6 text-foreground/60">{t("admin.publicDisplayConsentRequired")}</p>
                      ) : null}
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="flex justify-between">
                    <Button variant="ghost" className="text-danger" onPress={() => { messageModal.close(); setConfirmDeleteId(selected.id); }}>
                      {t("admin.delete")}
                    </Button>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant={selected.published ? "secondary" : "primary"}
                        isPending={publishingId === selected.id}
                        isDisabled={publishingId !== null || (!selected.published && !selected.allowPublicDisplay)}
                        onPress={() => void setMessagePublished(selected, !selected.published)}
                      >
                        {t(selected.published ? "admin.removeMessageApproval" : "admin.approveMessage")}
                      </Button>
                    <Button variant="secondary" onPress={() => setSelectedId(null)}>{t("admin.close")}</Button>
                    </div>
                  </Modal.Footer>
                </>
              ) : null}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </section>
  );
}

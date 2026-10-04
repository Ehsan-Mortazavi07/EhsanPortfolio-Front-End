"use client";

import { Button, Card, ListBox, Select, Spinner } from "@heroui/react";
import { useMemo, useState } from "react";
import { adminDelete, adminUpdate } from "@/common/api/admin";
import type { AdminUserDto } from "@/common/interfaces";
import { useTranslation } from "@/common/i18n/useTranslation";
import { parseApiError } from "@/common/utils/api-error";
import { formatAdminDate } from "@/common/utils/format-date";
import { isCreatorUser } from "@/common/utils/auth-user";
import { toast } from "@/common/utils/toast";
import { AdminListToolbar } from "@/components/admin/AdminListToolbar";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { useAdminList } from "@/components/admin/useAdminList";
import { tokenSelector, userSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

type StatusFilter = "all" | "pending";
const ROLE_OPTIONS: AdminUserDto["role"][] = ["user", "admin", "creator"];
type PendingUserAction = { type: "reject" | "delete"; id: string };

function statusLabelKey(status: AdminUserDto["status"]) {
  if (status === "pending") return "admin.userStatus.pending" as const;
  if (status === "rejected") return "admin.userStatus.rejected" as const;
  return "admin.userStatus.approved" as const;
}

function roleLabelKey(role: AdminUserDto["role"]) {
  if (role === "creator") return "admin.userRole.creator" as const;
  if (role === "admin") return "admin.userRole.admin" as const;
  return "admin.userRole.user" as const;
}

function statusClass(status: AdminUserDto["status"]) {
  if (status === "pending") return "admin-user-status admin-user-status--pending";
  if (status === "rejected") return "admin-user-status admin-user-status--rejected";
  return "admin-user-status admin-user-status--approved";
}

function roleClass(role: AdminUserDto["role"]) {
  if (role === "creator") return "admin-user-role admin-user-role--creator";
  if (role === "admin") return "admin-user-role admin-user-role--admin";
  return "admin-user-role admin-user-role--user";
}

export default function AdminUsersPage() {
  const { t, locale } = useTranslation();
  const token = useAppSelector(tokenSelector);
  const currentUser = useAppSelector(userSelector);
  const canManageRoles = isCreatorUser(currentUser);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleBusyId, setRoleBusyId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingUserAction | null>(null);
  const [confirmationBusy, setConfirmationBusy] = useState(false);
  const listParams = useMemo(
    () => ({ status: statusFilter === "pending" ? "pending" : undefined }),
    [statusFilter],
  );
  const { items, total, page, setPage, q, setQ, loading, reload, pageSize } =
    useAdminList<AdminUserDto>("/admin/users", 20, listParams);

  async function approveUser(id: string) {
    if (!token || !id) return;
    try {
      await adminUpdate(token, `/admin/users/${id}`, { status: "approved", role: "admin" });
      toast.success(t("admin.userApproved"));
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.loadFailed"));
    }
  }

  async function rejectUser(id: string) {
    if (!token || !id) return;
    try {
      await adminUpdate(token, `/admin/users/${id}`, { status: "rejected", role: "user" });
      toast.success(t("admin.userRejected"));
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.loadFailed"));
    }
  }

  async function changeRole(id: string, role: AdminUserDto["role"]) {
    if (!token || !id || !canManageRoles) return;
    if (currentUser?.id === id && role !== "creator") {
      toast.error(t("admin.selfRoleChangeForbidden"));
      return;
    }
    setRoleBusyId(id);
    try {
      await adminUpdate(token, `/admin/users/${id}`, { role });
      toast.success(t("admin.roleUpdated"));
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.loadFailed"));
    } finally {
      setRoleBusyId(null);
    }
  }

  async function deleteUser(id: string) {
    if (!token || !id || !canManageRoles) return;
    if (currentUser?.id === id) {
      toast.error(t("admin.selfUserDeleteForbidden"));
      return;
    }
    try {
      await adminDelete(token, `/admin/users/${id}`);
      toast.success(t("admin.userDeleted"));
      await reload();
    } catch (err) {
      toast.error(parseApiError(err, locale).message || t("admin.deleteFailed"));
    }
  }

  async function confirmPendingAction() {
    if (!pendingAction || confirmationBusy) return;
    setConfirmationBusy(true);
    try {
      if (pendingAction.type === "reject") await rejectUser(pendingAction.id);
      else await deleteUser(pendingAction.id);
      setPendingAction(null);
    } finally {
      setConfirmationBusy(false);
    }
  }

  return (
    <section className="space-y-6">
      <AdminConfirmDialog
        isOpen={pendingAction !== null}
        onOpenChange={(open) => { if (!open) setPendingAction(null); }}
        title={t("admin.confirmTitle")}
        message={t(
          pendingAction?.type === "reject"
            ? "admin.confirmRejectUser"
            : pendingAction?.type === "delete"
              ? "admin.confirmDeleteUser"
              : "admin.confirmAction",
        )}
        confirmLabel={t(pendingAction?.type === "reject" ? "admin.rejectUser" : "admin.deleteUser")}
        isPending={confirmationBusy}
        onConfirm={() => void confirmPendingAction()}
      />
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t("admin.users")}</h1>
        <p className="mt-1 text-sm text-foreground/60">{t("admin.usersSubtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === "all" ? "primary" : "secondary"}
          onPress={() => {
            setStatusFilter("all");
            setPage(1);
          }}
        >
          {t("admin.filterAllUsers")}
        </Button>
        <Button
          size="sm"
          variant={statusFilter === "pending" ? "primary" : "secondary"}
          onPress={() => {
            setStatusFilter("pending");
            setPage(1);
          }}
        >
          {t("admin.filterPendingUsers")}
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
      ) : items.length === 0 ? (
        <Card className="rounded-2xl p-8 text-center ring-1 ring-border/50">
          <p className="text-sm text-foreground/60">{t("admin.noItems")}</p>
        </Card>
      ) : (
        <div className="admin-table-wrap">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-border/50 bg-surface-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("auth.name")}</th>
                <th className="px-4 py-3 font-semibold">{t("auth.email")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.userStatusLabel")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.userRoleLabel")}</th>
                <th className="px-4 py-3 font-semibold">{t("admin.dateAdded")}</th>
                <th className="px-4 py-3 font-semibold text-end">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b border-border/30">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-foreground/70">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={statusClass(user.status)}>{t(statusLabelKey(user.status))}</span>
                  </td>
                  <td className="px-4 py-3">
                    {canManageRoles ? (
                      <Select
                        aria-label={t("admin.userRoleLabel")}
                        selectedKey={user.role}
                        isDisabled={roleBusyId === user.id}
                        onSelectionChange={(key) => {
                          if (key === "user" || key === "admin" || key === "creator") {
                            void changeRole(user.id, key);
                          }
                        }}
                        variant="secondary"
                        className="admin-themed-select-control"
                      >
                        <Select.Trigger className="admin-themed-select-trigger">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover className="admin-themed-select-popover">
                          <ListBox>
                            {ROLE_OPTIONS.map((role) => (
                              <ListBox.Item key={role} id={role} textValue={t(roleLabelKey(role))}>
                                {t(roleLabelKey(role))}
                                <ListBox.ItemIndicator>✓</ListBox.ItemIndicator>
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    ) : (
                      <span className={roleClass(user.role)}>{t(roleLabelKey(user.role))}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground/60">
                    {formatAdminDate(user.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex flex-wrap justify-end gap-2">
                      {user.status === "pending" || user.status === "rejected" ? (
                        <>
                          <Button size="sm" variant="primary" onPress={() => void approveUser(user.id)}>
                            {t("admin.approveUser")}
                          </Button>
                          {user.status === "pending" ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-danger"
                              onPress={() => setPendingAction({ type: "reject", id: user.id })}
                            >
                              {t("admin.rejectUser")}
                            </Button>
                          ) : null}
                        </>
                      ) : null}
                      {canManageRoles && currentUser?.id !== user.id ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-danger"
                          onPress={() => setPendingAction({ type: "delete", id: user.id })}
                        >
                          {t("admin.deleteUser")}
                        </Button>
                      ) : null}
                      {!canManageRoles &&
                      user.status !== "pending" &&
                      user.status !== "rejected" ? (
                        <span className="text-xs text-foreground/45">—</span>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

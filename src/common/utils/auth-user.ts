import type { IUser } from "@/common/interfaces";

export type AppUserRole = IUser["role"];

export function normalizeRole(raw: unknown): AppUserRole {
  const role = String(raw ?? "").toLowerCase();
  if (role === "creator") return "creator";
  if (role === "admin") return "admin";
  return "user";
}

export function normalizeAuthUser(raw: unknown): IUser {
  const data = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const status = String(data.status ?? "approved").toLowerCase();

  return {
    id: String(data.id ?? data._id ?? ""),
    email: String(data.email ?? ""),
    name: String(data.name ?? ""),
    role: normalizeRole(data.role),
    status:
      status === "pending" || status === "rejected" || status === "approved"
        ? status
        : "approved",
  };
}

export function hasPanelAccess(user: IUser | null | undefined): boolean {
  return user?.role === "admin" || user?.role === "creator";
}

export function isCreatorUser(user: IUser | null | undefined): boolean {
  return user?.role === "creator";
}

export function isAdminUser(user: IUser | null | undefined): boolean {
  return hasPanelAccess(user);
}

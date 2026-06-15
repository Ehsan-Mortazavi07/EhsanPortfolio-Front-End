import { axiosInstance } from "@/common/axiosInstance";
import type { AdminDashboardStats } from "@/common/interfaces";

function authHeader(token: string | null) {
  return { Authorization: `Bearer ${token}` };
}

export type AdminListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  status?: string;
};

export async function adminList<T>(
  token: string | null,
  path: string,
  params?: AdminListParams,
): Promise<{ items: T[]; total: number; page: number; pageSize: number }> {
  const res = await axiosInstance.get(path, {
    headers: authHeader(token),
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 20,
      ...(params?.q?.trim() ? { q: params.q.trim() } : {}),
      ...(params?.status ? { status: params.status } : {}),
    },
  });
  return res.data;
}

export async function adminGet<T>(token: string | null, path: string): Promise<T> {
  const res = await axiosInstance.get(path, { headers: authHeader(token) });
  return res.data;
}

export async function adminCreate<T>(token: string | null, path: string, body: unknown): Promise<T> {
  const res = await axiosInstance.post(path, body, { headers: authHeader(token) });
  return res.data;
}

export async function adminUpdate<T>(token: string | null, path: string, body: unknown): Promise<T> {
  const res = await axiosInstance.patch(path, body, { headers: authHeader(token) });
  return res.data;
}

export async function adminDelete<T>(token: string | null, path: string): Promise<T> {
  const res = await axiosInstance.delete(path, { headers: authHeader(token) });
  return res.data;
}

export async function adminUploadImage(
  token: string | null,
  file: File,
): Promise<{ path: string }> {
  const body = new FormData();
  body.append("file", file);
  const res = await axiosInstance.post<{ path: string }>("/admin/upload", body, {
    headers: authHeader(token),
    maxBodyLength: 15 * 1024 * 1024,
    maxContentLength: 15 * 1024 * 1024,
  });
  return res.data;
}

export async function adminDashboardStats(token: string | null): Promise<AdminDashboardStats> {
  return adminGet<AdminDashboardStats>(token, "/admin/dashboard/stats");
}

export async function adminUpdateSiteSettings(
  token: string | null,
  body: unknown,
): Promise<unknown> {
  const res = await axiosInstance.put("/admin/site-settings", body, {
    headers: authHeader(token),
  });
  return res.data;
}

export async function adminGetSiteSettings(token: string | null): Promise<unknown> {
  return adminGet(token, "/admin/site-settings");
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { adminList } from "@/common/api/admin";
import { toast } from "@/common/utils/toast";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

export function useAdminList<T>(
  path: string,
  pageSize = 20,
  extraParams?: Record<string, string | undefined>,
) {
  const token = useAppSelector(tokenSelector);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = q.trim();
      setDebouncedQ((prev) => {
        if (next !== prev) setPage(1);
        return next;
      });
    }, 400);
    return () => window.clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await adminList<T>(token, path, {
        page,
        pageSize,
        q: debouncedQ || undefined,
        ...extraParams,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load list");
    } finally {
      setLoading(false);
    }
  }, [token, path, page, pageSize, debouncedQ, extraParams]);

  useEffect(() => {
    void load();
  }, [load]);

  return { items, total, page, setPage, q, setQ, loading, reload: load, pageSize };
}

"use client";

import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import { adminDashboardStats } from "@/common/api/admin";
import type { AdminDashboardStats } from "@/common/interfaces";
import type { MessageKey } from "@/common/i18n";
import { useTranslation } from "@/common/i18n/useTranslation";
import { toast } from "@/common/utils/toast";
import { tokenSelector } from "@/stores/auth/selectors";
import { useAppSelector } from "@/stores/hooks";

const fallback: AdminDashboardStats = {
  projects: 0,
  services: 0,
  experience: 0,
  skills: 0,
  testimonials: 0,
  articles: 0,
  contactMessages: 0,
  unreadMessages: 0,
};

const statKeys: { key: keyof AdminDashboardStats; labelKey: MessageKey }[] = [
  { key: "projects", labelKey: "admin.stats.projects" },
  { key: "services", labelKey: "admin.stats.services" },
  { key: "experience", labelKey: "admin.stats.experience" },
  { key: "skills", labelKey: "admin.stats.skills" },
  { key: "testimonials", labelKey: "admin.stats.testimonials" },
  { key: "articles", labelKey: "admin.stats.articles" },
  { key: "contactMessages", labelKey: "admin.stats.messages" },
  { key: "unreadMessages", labelKey: "admin.stats.unread" },
];

export default function AdminDashboardPage() {
  const token = useAppSelector(tokenSelector);
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    void (async () => {
      try {
        const data = await adminDashboardStats(token);
        setStats(data);
      } catch {
        setStats(fallback);
        toast.warning("API unavailable");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-12">
        <Spinner size="sm" />
        <span className="text-sm text-[var(--content-fg-muted)]">{t("admin.loading")}</span>
      </div>
    );
  }

  const s = stats ?? fallback;

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">{t("admin.dashboard")}</h1>
        <p className="mt-1 text-sm text-[var(--content-fg-muted)]">{t("admin.dashboardSubtitle")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statKeys.map(({ key, labelKey }) => (
          <div key={key} className="admin-stat-card">
            <p className="admin-stat-label">{t(labelKey)}</p>
            <p className="admin-stat-value">{s[key]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

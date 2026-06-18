"use client";

import { AdminDualLocaleFields } from "@/components/admin/AdminDualLocaleFields";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { PageSubtitleKey, SiteSettingsDto } from "@/common/interfaces";

type Props = {
  values: SiteSettingsDto;
  setFieldValue: (field: string, value: unknown) => void;
};

const PAGES: { key: PageSubtitleKey; labelKey: string }[] = [
  { key: "services", labelKey: "admin.pageSubtitleServices" },
  { key: "experience", labelKey: "admin.pageSubtitleExperience" },
  { key: "projects", labelKey: "admin.pageSubtitleProjects" },
  { key: "testimonials", labelKey: "admin.pageSubtitleTestimonials" },
];

export function AdminPageSubtitlesFields({ values, setFieldValue }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--card-border)] bg-[var(--tag-bg)] p-5">
      <div>
        <h2 className="text-lg font-bold">{t("admin.pageSubtitlesTitle")}</h2>
        <p className="mt-1 text-sm text-foreground/60">{t("admin.pageSubtitlesHint")}</p>
      </div>

      {PAGES.map(({ key, labelKey }) => (
        <div key={key} className="space-y-3 rounded-xl border border-[var(--card-border)] bg-background/40 p-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground/70">{t(labelKey as never)}</p>
          <AdminDualLocaleFields
            enName={`pageSubtitles.${key}.subtitle`}
            faName={`pageSubtitles.${key}.subtitleFa`}
            enLabel={t("admin.pageSubtitle")}
            values={values}
            setFieldValue={setFieldValue}
            multiline
          />
        </div>
      ))}
    </div>
  );
}

"use client";

import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { ExperienceSection } from "@/components/pages/home/ExperienceSection";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { ExperienceDto, SiteSettingsDto } from "@/common/interfaces";

type Props = { experience: ExperienceDto[]; settings: SiteSettingsDto };

export function ExperiencePage({ experience, settings }: Props) {
  const { t } = useTranslation();

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("experience.label")}
          title={t("experience.pageTitle")}
          subtitle={t("experience.pageSubtitle")}
        />
      }
    >
      <ExperienceSection experience={experience} hideHeader />
    </PublicPageLayout>
  );
}

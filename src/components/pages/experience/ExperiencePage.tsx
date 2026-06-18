"use client";

import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { ExperienceSection } from "@/components/pages/home/ExperienceSection";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ExperienceDto, SiteSettingsDto } from "@/common/interfaces";
import { resolvePageSubtitle } from "@/common/utils";

type Props = { experience: ExperienceDto[]; settings: SiteSettingsDto };

export function ExperiencePage({ experience, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const subtitle = resolvePageSubtitle(settings, "experience", l, t, "experience.pageSubtitle");

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("experience.label")}
          title={t("experience.pageTitle")}
          subtitle={subtitle}
        />
      }
    >
      <ExperienceSection experience={experience} hideHeader />
    </PublicPageLayout>
  );
}

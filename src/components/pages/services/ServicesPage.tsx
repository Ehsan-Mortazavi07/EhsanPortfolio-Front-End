"use client";

import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { ServicesSection } from "@/components/pages/home/ServicesSection";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ServiceDto, SiteSettingsDto } from "@/common/interfaces";
import { resolvePageSubtitle } from "@/common/utils";

type Props = { services: ServiceDto[]; settings: SiteSettingsDto };

export function ServicesPage({ services, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const subtitle = resolvePageSubtitle(settings, "services", l, t, "services.pageSubtitle");

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("services.label")}
          title={t("services.pageTitle")}
          subtitle={subtitle}
        />
      }
    >
      <ServicesSection services={services} hideHeader />
    </PublicPageLayout>
  );
}

"use client";

import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { ServicesSection } from "@/components/pages/home/ServicesSection";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { ServiceDto, SiteSettingsDto } from "@/common/interfaces";

type Props = { services: ServiceDto[]; settings: SiteSettingsDto };

export function ServicesPage({ services, settings }: Props) {
  const { t } = useTranslation();

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("services.label")}
          title={t("services.pageTitle")}
          subtitle={t("services.pageSubtitle")}
        />
      }
    >
      <ServicesSection services={services} hideHeader />
    </PublicPageLayout>
  );
}

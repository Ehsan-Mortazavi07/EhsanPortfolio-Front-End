"use client";

import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { TestimonialsSection } from "@/components/pages/home/TestimonialsSection";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { SiteSettingsDto, TestimonialDto } from "@/common/interfaces";

type Props = { testimonials: TestimonialDto[]; settings: SiteSettingsDto };

export function TestimonialsPage({ testimonials, settings }: Props) {
  const { t } = useTranslation();

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("testimonials.label")}
          title={t("testimonials.pageTitle")}
          subtitle={t("testimonials.pageSubtitle")}
        />
      }
    >
      <TestimonialsSection testimonials={testimonials} hideHeader />
    </PublicPageLayout>
  );
}

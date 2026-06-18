"use client";

import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { TestimonialsSection } from "@/components/pages/home/TestimonialsSection";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { SiteSettingsDto, TestimonialDto } from "@/common/interfaces";
import { resolvePageSubtitle } from "@/common/utils";

type Props = { testimonials: TestimonialDto[]; settings: SiteSettingsDto };

export function TestimonialsPage({ testimonials, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const subtitle = resolvePageSubtitle(settings, "testimonials", l, t, "testimonials.pageSubtitle");

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("testimonials.label")}
          title={t("testimonials.pageTitle")}
          subtitle={subtitle}
        />
      }
    >
      <TestimonialsSection testimonials={testimonials} hideHeader />
    </PublicPageLayout>
  );
}

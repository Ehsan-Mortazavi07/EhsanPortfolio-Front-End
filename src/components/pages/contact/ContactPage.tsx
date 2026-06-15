"use client";

import { ContactForm } from "@/components/pages/contact/ContactForm";
import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { SocialLinks } from "@/components/common/social/SocialLinks";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { SiteSettingsDto } from "@/common/interfaces";
import { withSocialDefaults } from "@/common/utils/site-settings";

type Props = { settings: SiteSettingsDto };

export function ContactPage({ settings }: Props) {
  const { t } = useTranslation();
  const socialSettings = withSocialDefaults(settings);

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("contact.label")}
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
        />
      }
    >
      <div className="section-container grid max-w-4xl gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="text-sm leading-relaxed text-foreground/65">{t("contact.subtitle")}</p>
          <p className="mt-8 text-sm">
            <span className="font-semibold uppercase tracking-wide">{t("contact.email")}:</span>{" "}
            <a href={`mailto:${settings.email}`} className="text-foreground/80 underline-offset-4 hover:underline">
              {settings.email}
            </a>
          </p>
          {settings.location && (
            <p className="mt-2 text-sm">
              <span className="font-semibold uppercase tracking-wide">Location:</span> {settings.location}
            </p>
          )}
          <div className="mt-8">
            <SocialLinks settings={socialSettings} variant="labeled" />
          </div>
        </div>
        <div className="green-card">
          <ContactForm />
        </div>
      </div>
    </PublicPageLayout>
  );
}

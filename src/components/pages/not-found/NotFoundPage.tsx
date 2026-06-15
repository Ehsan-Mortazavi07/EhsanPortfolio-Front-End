"use client";

import NextLink from "next/link";
import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import { PublicShell } from "@/components/common/shell";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { SiteSettingsDto } from "@/common/interfaces";

type Props = {
  settings: SiteSettingsDto;
};

export function NotFoundPage({ settings }: Props) {
  const { t } = useTranslation();

  return (
    <PublicShell>
      <Navbar variant="hero" />
      <main>
        <section className="hero-section min-h-dvh">
          <div className="hero-atmosphere" aria-hidden />
          <div className="hero-pillars" aria-hidden />
          <div className="hero-mist" aria-hidden />

          <div className="hero-content flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-28 text-center sm:px-6 sm:pt-32">
            <p className="hero-badge mb-6">
              <span className="hero-badge-dot" />
              {t("notFound.label")}
            </p>
            <h1 className="hero-headline text-[clamp(4.5rem,18vw,9rem)] leading-none">{t("notFound.code")}</h1>
            <p className="hero-subline mt-6 max-w-md text-base sm:text-lg">{t("notFound.message")}</p>
            <NextLink href={PATHS.HOME} className="pill-cta mt-10">
              {t("notFound.backHome")}
            </NextLink>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </PublicShell>
  );
}

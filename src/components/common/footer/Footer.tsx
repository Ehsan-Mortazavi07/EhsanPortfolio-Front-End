"use client";

import NextLink from "next/link";
import { Sms } from "iconsax-reactjs";
import { usePathname } from "next/navigation";
import { FOOTER_NAV } from "@/common/constants/footer-nav";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { SiteSettingsDto } from "@/common/interfaces";
import { withSocialDefaults } from "@/common/utils/site-settings";
import { SocialLinks } from "@/components/common/social/SocialLinks";

type Props = { settings: SiteSettingsDto };

export function Footer({ settings }: Props) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const socialSettings = withSocialDefaults(settings);

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <footer className="site-footer-bar">
      <div className="section-container py-8 sm:py-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-3">
          <div className="min-w-0">
            <p className="text-base font-bold tracking-tight sm:text-lg">Ehsan Mortazavi</p>
            <p className="footer-muted mt-2 text-sm leading-relaxed">{t("footer.role")}</p>
            <p className="footer-muted mt-4 break-words text-sm [overflow-wrap:anywhere]">{settings.email}</p>
            {settings.location && (
              <p className="footer-muted mt-1 break-words text-sm">{settings.location}</p>
            )}
          </div>

          <div className="min-w-0">
            <p className="footer-heading">{t("footer.explore")}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-2 sm:mt-4 sm:gap-x-4">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <NextLink href={item.href} className="footer-link text-xs sm:text-sm">
                    {t(item.labelKey)}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 min-w-0 lg:col-span-1">
            <div className="flex flex-wrap items-center justify-between gap-3 lg:block">
              <p className="footer-heading">{t("footer.collaborate")}</p>
              <NextLink href={PATHS.CONTACT} className="footer-cta inline-flex lg:mt-5">
                {t("footer.contactMe")}
              </NextLink>
            </div>
            <p className="footer-muted mt-3 hidden text-sm leading-relaxed sm:block">{t("footer.collaborateSubtitle")}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 lg:mt-6">
              <SocialLinks settings={socialSettings} />
              <a href={`mailto:${settings.email}`} className="footer-social" aria-label="Email">
                <Sms size={20} variant="Linear" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="section-container flex flex-col items-center gap-4 py-5 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:py-6 sm:text-start">
          <p className="footer-muted min-w-0 max-w-full break-words">
            © {new Date().getFullYear()} Ehsan Mortazavi. {t("footer.rights")}
          </p>
          <div className="hidden w-full flex-wrap gap-4 sm:flex sm:w-auto sm:justify-end">
            {FOOTER_NAV.slice(0, 4).map((item) => (
              <NextLink key={item.href} href={item.href} className="footer-link text-xs">
                {t(item.labelKey)}
              </NextLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

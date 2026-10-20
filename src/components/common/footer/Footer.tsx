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
      <div className="section-container py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-3">
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <p className="text-lg font-bold tracking-tight">Ehsan Mortazavi</p>
            <p className="footer-muted mt-2 text-sm leading-relaxed">{t("footer.role")}</p>
            <p className="footer-muted mt-4 break-words text-sm [overflow-wrap:anywhere]">{settings.email}</p>
            {settings.location && (
              <p className="footer-muted mt-1 break-words text-sm">{settings.location}</p>
            )}
          </div>

          <div className="min-w-0">
            <p className="footer-heading">{t("footer.explore")}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <NextLink href={item.href} className="footer-link">
                    {t(item.labelKey)}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <p className="footer-heading">{t("footer.collaborate")}</p>
            <p className="footer-muted mt-3 text-sm leading-relaxed">{t("footer.collaborateSubtitle")}</p>
            <NextLink href={PATHS.CONTACT} className="footer-cta mt-5 inline-flex">
              {t("footer.contactMe")}
            </NextLink>

            <div className="mt-6 flex flex-wrap items-center gap-3">
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
          <div className="grid w-full grid-cols-2 justify-items-center gap-x-5 gap-y-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end sm:gap-4">
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

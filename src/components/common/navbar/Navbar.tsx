"use client";

import { Button, cn } from "@heroui/react";
import { HamburgerMenu, Minus } from "iconsax-reactjs";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/common/brand/Logo";
import { LocaleSwitcher } from "@/components/common/preferences/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/common/preferences/ThemeSwitcher";
import { PUBLIC_NAV } from "@/common/constants/nav";
import { useTranslation } from "@/common/i18n/useTranslation";

type MobileNavProps = {
  open: boolean;
  pathname: string;
  onNavigate: () => void;
};

function MobileNavPanel({ open, pathname, onNavigate }: MobileNavProps) {
  const { t } = useTranslation();

  return (
    <nav
      id="mobile-nav-panel"
      aria-hidden={!open}
      inert={open ? undefined : true}
      className={cn("site-chrome-mobile-nav xl:hidden", open && "site-chrome-mobile-nav--open")}
    >
      <div className="site-chrome-mobile-nav-inner">
        <div className="section-container site-chrome-mobile-nav-links flex flex-col gap-2 py-3">
          {PUBLIC_NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <NextLink
                key={item.href}
                href={item.href}
                tabIndex={open ? undefined : -1}
                onClick={onNavigate}
                className={cn("site-chrome-mobile-link", active && "site-chrome-mobile-link-active")}
              >
                {t(item.labelKey)}
              </NextLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function Navbar({ variant = "hero" }: { variant?: "hero" | "inner" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const onHero = variant === "hero";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const linkClass = (active: boolean) => cn("nav-link", active && "nav-link-active");
  const closeMenu = () => setOpen(false);

  return (
    <header
      className={cn(
        "site-chrome inset-x-0 top-0 z-50",
        onHero && "site-chrome--hero-mobile site-chrome--overlay",
        !onHero && "site-chrome--bar sticky",
        open && "site-chrome--menu-open",
      )}
    >
      <div className="section-container flex h-[var(--site-chrome-bar-height)] items-center justify-between gap-3">
        <Logo light />

        <nav className="absolute left-1/2 hidden max-w-[52%] -translate-x-1/2 items-center xl:max-w-none xl:flex">
          {PUBLIC_NAV.map((item, index) => {
            const active = item.match(pathname);
            return (
              <span key={item.href} className="flex items-center">
                {index > 0 && <span className="nav-bullet px-1.5 xl:px-2">•</span>}
                <NextLink href={item.href} className={linkClass(active)}>
                  {t(item.labelKey)}
                </NextLink>
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <div className={cn("flex items-center gap-0.5 sm:gap-1", open && "hidden xl:flex")}>
            <ThemeSwitcher chrome />
            <LocaleSwitcher chrome />
          </div>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            className="site-chrome-btn xl:hidden"
            onPress={() => setOpen((v) => !v)}
          >
            {open ? <Minus size={22} variant="Linear" /> : <HamburgerMenu size={22} variant="Linear" />}
          </Button>
        </div>
      </div>

      <MobileNavPanel open={open} pathname={pathname} onNavigate={closeMenu} />
    </header>
  );
}

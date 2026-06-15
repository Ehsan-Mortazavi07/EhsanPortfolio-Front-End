"use client";

import { Button, cn } from "@heroui/react";
import { HamburgerMenu } from "iconsax-reactjs";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/common/brand/Logo";
import { LocaleSwitcher } from "@/components/common/preferences/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/common/preferences/ThemeSwitcher";
import { PUBLIC_NAV } from "@/common/constants/nav";
import { useTranslation } from "@/common/i18n/useTranslation";

export function Navbar({ variant = "hero" }: { variant?: "hero" | "inner" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const onHero = variant === "hero";

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const linkClass = (active: boolean) => cn("nav-link", active && "nav-link-active");

  return (
    <header
      className={cn(
        "site-chrome inset-x-0 top-0 z-50",
        onHero ? "site-chrome--overlay absolute" : "site-chrome--bar sticky",
      )}
    >
      <div className="section-container flex h-[4.25rem] items-center justify-between gap-3 sm:h-[4.75rem]">
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

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-0.5 sm:flex">
            <ThemeSwitcher chrome />
            <LocaleSwitcher chrome />
          </div>
          <Button
            isIconOnly
            variant="ghost"
            size="sm"
            aria-label="Menu"
            className="site-chrome-btn xl:hidden"
            onPress={() => setOpen((v) => !v)}
          >
            <HamburgerMenu size={22} variant="Linear" />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {PUBLIC_NAV.map((item) => (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="site-chrome-mobile-link"
              >
                {t(item.labelKey)}
              </NextLink>
            ))}
            <div className="flex items-center gap-2 pt-2">
              <ThemeSwitcher chrome />
              <LocaleSwitcher chrome />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

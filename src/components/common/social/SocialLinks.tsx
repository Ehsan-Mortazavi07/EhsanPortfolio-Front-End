"use client";

import type { SiteSettingsDto } from "@/common/interfaces";
import { SocialBrandIcon, type SocialBrand } from "./SocialBrandIcon";

type SocialItem = {
  brand: SocialBrand;
  href: string | null | undefined;
  label: string;
};

type Props = {
  settings: SiteSettingsDto;
  variant?: "icons" | "labeled";
  className?: string;
  iconClassName?: string;
};

function buildItems(settings: SiteSettingsDto): SocialItem[] {
  const items: SocialItem[] = [
    { brand: "github", href: settings.githubUrl, label: "GitHub" },
    { brand: "linkedin", href: settings.linkedinUrl, label: "LinkedIn" },
    { brand: "telegram", href: settings.telegramUrl, label: "Telegram" },
    { brand: "instagram", href: settings.instagramUrl, label: "Instagram" },
  ];
  return items.filter((item) => Boolean(item.href));
}

export function SocialLinks({ settings, variant = "icons", className = "", iconClassName = "" }: Props) {
  const items = buildItems(settings);
  if (items.length === 0) return null;

  if (variant === "labeled") {
    return (
      <div className={`flex flex-wrap items-center gap-6 ${className}`.trim()}>
        {items.map((item) => (
          <a
            key={item.brand}
            href={item.href!}
            target="_blank"
            rel="noreferrer"
            className="social-link-labeled"
          >
            <SocialBrandIcon brand={item.brand} size={18} className={iconClassName} />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`.trim()}>
      {items.map((item) => (
        <a
          key={item.brand}
          href={item.href!}
          target="_blank"
          rel="noreferrer"
          className="footer-social"
          aria-label={item.label}
        >
          <SocialBrandIcon brand={item.brand} size={20} className={iconClassName} />
        </a>
      ))}
    </div>
  );
}

export function socialTextLinks(settings: SiteSettingsDto): SocialItem[] {
  return buildItems(settings);
}

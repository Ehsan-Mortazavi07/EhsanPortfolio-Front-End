"use client";

import Image from "next/image";
import NextLink from "next/link";
import { PATHS } from "@/common/constants";
import { DEFAULT_BRAND_LOGO, resolvePublicUploadUrl } from "@/common/utils";

type Props = {
  light?: boolean;
  compact?: boolean;
  imageUrl?: string | null;
};

export function Logo({ light, compact = false, imageUrl }: Props) {
  const logoUrl = resolvePublicUploadUrl(imageUrl);
  const usesDefaultLogo = !logoUrl || logoUrl === DEFAULT_BRAND_LOGO;

  return (
    <NextLink href={PATHS.HOME} className={`group flex items-center ${compact ? "gap-2" : "gap-2 sm:gap-3"}`}>
      <Image
        src={logoUrl || DEFAULT_BRAND_LOGO}
        alt=""
        aria-hidden="true"
        width={80}
        height={40}
        unoptimized
        className={`${compact ? "h-8" : "h-8 sm:h-10"} w-auto shrink-0 object-contain transition-opacity group-hover:opacity-80 ${
          light && usesDefaultLogo ? "brightness-0 invert" : ""
        }`}
      />
      <span
        className={`${compact ? "text-sm" : "text-[0.9375rem] sm:text-lg"} whitespace-nowrap font-bold leading-none tracking-tight ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        Ehsan<span className={light ? "text-white/70" : "text-foreground/40"}> Mortazavi</span>
      </span>
    </NextLink>
  );
}

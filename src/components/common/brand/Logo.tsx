"use client";

import Image from "next/image";
import NextLink from "next/link";
import { PATHS } from "@/common/constants";

type Props = {
  light?: boolean;
  compact?: boolean;
};

export function Logo({ light, compact = false }: Props) {
  return (
    <NextLink href={PATHS.HOME} className={`group flex items-center ${compact ? "gap-2" : "gap-2 sm:gap-3"}`}>
      <Image
        src="/images/brand/em-monogram.png"
        alt=""
        aria-hidden="true"
        width={80}
        height={40}
        className={`${compact ? "h-8" : "h-8 sm:h-10"} w-auto shrink-0 object-contain transition-opacity group-hover:opacity-80 ${
          light ? "brightness-0 invert" : ""
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

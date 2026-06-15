"use client";

import NextLink from "next/link";
import { BrandMark } from "@/components/common/brand/BrandMark";
import { PATHS } from "@/common/constants";

type Props = {
  light?: boolean;
  hero?: boolean;
};

export function Logo({ light, hero }: Props) {
  const onHero = hero || light;

  return (
    <NextLink href={PATHS.HOME} className="auth-logo group flex items-center gap-2.5">
      <span
        className={`auth-logo-mark flex size-9 items-center justify-center rounded-xl border transition ${
          onHero
            ? "border-white/28 bg-white/12 text-white group-hover:bg-white/18"
            : "border-foreground/12 bg-foreground/5 text-foreground group-hover:bg-foreground/8"
        }`}
      >
        <BrandMark size={22} />
      </span>
      <span
        className={`auth-logo-text text-sm font-bold tracking-tight sm:text-[0.95rem] ${
          onHero ? "text-white" : "text-foreground"
        }`}
      >
        Ehsan
        <span className={onHero ? "text-white/80" : "text-foreground/40"}> Mortazavi</span>
      </span>
    </NextLink>
  );
}

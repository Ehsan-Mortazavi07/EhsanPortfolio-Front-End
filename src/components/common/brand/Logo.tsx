"use client";

import NextLink from "next/link";
import { BrandMark } from "@/components/common/brand/BrandMark";
import { PATHS } from "@/common/constants";

type Props = {
  light?: boolean;
};

export function Logo({ light }: Props) {
  return (
    <NextLink href={PATHS.HOME} className="group flex items-center gap-2.5">
      <span
        className={`flex size-9 items-center justify-center rounded-xl border transition ${
          light
            ? "border-white/20 bg-white/8 text-white group-hover:bg-white/12"
            : "border-foreground/12 bg-foreground/5 text-foreground group-hover:bg-foreground/8"
        }`}
      >
        <BrandMark size={22} />
      </span>
      <span className={`text-sm font-bold tracking-tight sm:text-[0.95rem] ${light ? "text-white" : "text-foreground"}`}>
        Ehsan<span className={light ? "text-white/70" : "text-foreground/40"}> Mortazavi</span>
      </span>
    </NextLink>
  );
}

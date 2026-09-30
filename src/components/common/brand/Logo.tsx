"use client";

import Image from "next/image";
import NextLink from "next/link";
import { PATHS } from "@/common/constants";

type Props = {
  light?: boolean;
};

export function Logo({ light }: Props) {
  return (
    <NextLink href={PATHS.HOME} className="group flex items-center gap-2 sm:gap-3">
      <Image
        src="/images/brand/em-monogram.png"
        alt=""
        aria-hidden="true"
        width={80}
        height={40}
        className={`h-8 w-auto shrink-0 object-contain transition-opacity group-hover:opacity-80 sm:h-10 ${
          light ? "brightness-0 invert" : ""
        }`}
      />
      <span
        className={`whitespace-nowrap text-[0.9375rem] font-bold leading-none tracking-tight sm:text-lg ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        Ehsan<span className={light ? "text-white/70" : "text-foreground/40"}> Mortazavi</span>
      </span>
    </NextLink>
  );
}

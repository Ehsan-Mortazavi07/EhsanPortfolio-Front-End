"use client";

import Image from "next/image";
import NextLink from "next/link";
import { PATHS } from "@/common/constants";

type Props = {
  light?: boolean;
};

export function Logo({ light }: Props) {
  return (
    <NextLink href={PATHS.HOME} className="group flex items-center gap-2.5">
      <Image
        src="/images/brand/em-monogram.png"
        alt=""
        aria-hidden="true"
        width={58}
        height={29}
        className={`h-7 w-auto shrink-0 object-contain transition-opacity group-hover:opacity-80 ${
          light ? "brightness-0 invert" : ""
        }`}
      />
      <span className={`text-sm font-bold tracking-tight sm:text-[0.95rem] ${light ? "text-white" : "text-foreground"}`}>
        Ehsan<span className={light ? "text-white/70" : "text-foreground/40"}> Mortazavi</span>
      </span>
    </NextLink>
  );
}

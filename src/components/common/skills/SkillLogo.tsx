"use client";

import Image from "next/image";
import { useState } from "react";
import type { SkillDto } from "@/common/interfaces";
import { resolveIconSrc } from "@/common/utils";
import { skillIconUrl } from "@/common/utils/skill-icon";

type Props = { skill: SkillDto; size?: "sm" | "md" };

export function SkillLogo({ skill, size = "md" }: Props) {
  const customIcon = resolveIconSrc(skill.icon);
  const fallbackIcon = skillIconUrl(skill.slug, skill.name);
  const isCustomIcon = Boolean(customIcon);
  const iconSrc = customIcon || fallbackIcon;
  const initial = skill.name.trim().charAt(0).toUpperCase();
  const box = size === "sm" ? "skill-logo skill-logo--sm" : "skill-logo";
  const dimension = size === "sm" ? 22 : 28;
  const [failed, setFailed] = useState(false);

  if (!iconSrc || failed) {
    return (
      <div className={box} aria-hidden>
        <span className="skill-logo-fallback">{initial}</span>
      </div>
    );
  }

  if (isCustomIcon) {
    return (
      <div className={box} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customIcon!}
          alt=""
          className="skill-logo-img-custom"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={box} aria-hidden>
      <Image
        src={iconSrc}
        alt=""
        width={dimension}
        height={dimension}
        className="skill-logo-img"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}

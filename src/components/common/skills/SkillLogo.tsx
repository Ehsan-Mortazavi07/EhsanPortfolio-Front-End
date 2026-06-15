"use client";

import Image from "next/image";
import type { SkillDto } from "@/common/interfaces";
import { skillIconUrl } from "@/common/utils/skill-icon";

type Props = { skill: SkillDto; size?: "sm" | "md" };

export function SkillLogo({ skill, size = "md" }: Props) {
  const iconSrc = skillIconUrl(skill.slug, skill.name);
  const initial = skill.name.trim().charAt(0).toUpperCase();
  const box = size === "sm" ? "skill-logo skill-logo--sm" : "skill-logo";

  return (
    <div className={box} aria-hidden>
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt=""
          width={size === "sm" ? 22 : 28}
          height={size === "sm" ? 22 : 28}
          className="skill-logo-img"
          unoptimized
        />
      ) : (
        <span className="skill-logo-fallback">{initial}</span>
      )}
    </div>
  );
}

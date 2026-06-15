"use client";

import { motion } from "motion/react";
import { SkillLogo } from "@/components/common/skills/SkillLogo";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { SkillDto } from "@/common/interfaces";

type Props = { skills: SkillDto[] };

export function SkillsSection({ skills }: Props) {
  const { t } = useTranslation();

  if (skills.length === 0) return null;

  return (
    <section className="border-t border-[var(--section-divider)] py-24" id="skills">
      <div className="section-container">
        <p className="section-label">{t("skills.label")}</p>
        <h2 className="section-title mt-3">{t("skills.title")}</h2>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <div className="skill-card">
                <SkillLogo skill={skill} />
                <p className="skill-card-name">{skill.name}</p>
                <p className="skill-card-category">{skill.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

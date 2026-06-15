"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ExperienceDto } from "@/common/interfaces";

type Props = { experience: ExperienceDto[]; hideHeader?: boolean };

export function ExperienceSection({ experience, hideHeader }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();

  return (
    <section className={hideHeader ? "py-16" : "experience-section py-24"} id="experience">
      <div className="section-container">
        {!hideHeader && (
          <>
            <p className="section-label">{t("experience.label")}</p>
            <h2 className="section-title mt-3">{t("experience.title")}</h2>
          </>
        )}

        <div className={hideHeader ? "experience-panel" : "experience-panel mt-12"}>
          {experience.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`experience-row ${item.current ? "experience-row--current" : ""}`}
            >
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${item.current ? "opacity-55" : "text-[var(--content-fg-muted)]"}`}>
                  {l(item.period, item.periodFa)}
                </p>
                <h3 className="mt-2 text-xl font-bold">{l(item.role, item.roleFa)}</h3>
                <p className={`mt-1 font-medium ${item.current ? "opacity-80" : "text-[var(--content-fg-muted)]"}`}>
                  {l(item.company, item.companyFa)}
                </p>
              </div>
              <p className={`max-w-xl text-sm leading-relaxed sm:text-end ${item.current ? "opacity-75" : "text-[var(--content-fg-muted)]"}`}>
                {l(item.description, item.descriptionFa)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

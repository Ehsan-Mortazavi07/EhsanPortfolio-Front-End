"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { TestimonialDto } from "@/common/interfaces";

type Props = { testimonials: TestimonialDto[]; hideHeader?: boolean };

export function TestimonialsSection({ testimonials, hideHeader }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();

  if (testimonials.length === 0) return null;

  return (
    <section className={hideHeader ? "py-16" : "border-t border-[var(--section-divider)] py-24"} id="testimonials">
      <div className="section-container">
        {!hideHeader && (
          <>
            <p className="section-label">{t("testimonials.label")}</p>
            <h2 className="section-title mt-3">{t("testimonials.title")}</h2>
          </>
        )}

        <div className={hideHeader ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"}>
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="green-card h-full">
                <p className="text-sm leading-relaxed text-[var(--content-fg-muted)]">&ldquo;{l(item.content, item.contentFa)}&rdquo;</p>
                <div className="mt-6 border-t border-[var(--experience-row-border)] pt-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs text-[var(--content-fg-muted)]">
                    {item.role} · {item.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

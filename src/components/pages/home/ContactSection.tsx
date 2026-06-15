"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/common/i18n/useTranslation";
import type { SiteSettingsDto } from "@/common/interfaces";
import { ContactForm } from "@/components/pages/contact/ContactForm";

type Props = { settings: SiteSettingsDto };

export function ContactSection({ settings: _settings }: Props) {
  const { t } = useTranslation();

  return (
    <section className="contact-band py-24" id="contact">
      <div className="section-container grid gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-50">{t("contact.label")}</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">{t("contact.title")}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed opacity-70">{t("contact.subtitle")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <div className="glass-card p-6 sm:p-8">
            <ContactForm dark />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

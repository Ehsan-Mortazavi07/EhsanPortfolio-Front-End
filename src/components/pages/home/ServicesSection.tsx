"use client";

import { motion } from "motion/react";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ServiceDto } from "@/common/interfaces";
import { resolveIconSrc } from "@/common/utils";

type Props = { services: ServiceDto[]; hideHeader?: boolean };

function ServiceIcon({ icon }: { icon: string }) {
  const src = resolveIconSrc(icon);
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="size-8 shrink-0 object-contain" loading="lazy" />
  );
}

export function ServicesSection({ services, hideHeader }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();

  if (services.length === 0) return null;

  return (
    <section className="py-24" id="services">
      <div className="section-container">
        {!hideHeader && (
          <>
            <p className="section-label">{t("services.label")}</p>
            <h2 className="section-title mt-3">{t("services.title")}</h2>
          </>
        )}

        <div className={hideHeader ? "grid gap-6 md:grid-cols-3" : "mt-12 grid gap-6 md:grid-cols-3"}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="service-card h-full">
                {service.icon ? <ServiceIcon icon={service.icon} /> : null}
                <h3 className={`text-lg font-bold uppercase tracking-tight ${service.icon ? "mt-6" : ""}`}>
                  {l(service.title, service.titleFa)}
                </h3>
                <p className="service-card-desc mt-3 text-sm leading-relaxed">
                  {l(service.description, service.descriptionFa)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

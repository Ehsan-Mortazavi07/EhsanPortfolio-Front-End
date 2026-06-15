"use client";

import { Button } from "@heroui/react";
import { ArrowUp2 } from "iconsax-reactjs";
import { motion } from "motion/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ProjectDto } from "@/common/interfaces";
import { resolvePublicUploadUrl } from "@/common/utils";

type Props = { projects: ProjectDto[] };

export function ProjectsSection({ projects }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const l = useLocalizedText();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const grid = [...featured, ...rest].slice(0, 6);

  return (
    <section className="py-24" id="projects">
      <div className="section-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">{t("projects.label")}</p>
            <h2 className="section-title mt-3">{t("projects.title")}</h2>
          </div>
          <Button
            variant="secondary"
            className="rounded-full border font-semibold uppercase tracking-wider"
            onPress={() => router.push(PATHS.PROJECTS)}
          >
            {t("projects.viewAll")}
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((project, index) => {
            const title = l(project.title, project.titleFa);
            const excerpt = l(project.excerpt, project.excerptFa);
            const cover = resolvePublicUploadUrl(project.coverImageUrl);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <NextLink href={PATHS.PROJECT(project.slug)} className="group block h-full">
                  <div className="green-card flex h-full flex-col overflow-hidden !p-0">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--card-border)]">
                      {cover ? (
                        <Image src={cover} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="400px" />
                      ) : (
                        <div className="image-placeholder size-full" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold uppercase tracking-tight group-hover:underline">{title}</h3>
                        <ArrowUp2 size={18} className="shrink-0 text-foreground/35 transition group-hover:text-foreground" />
                      </div>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/65">{excerpt}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tag-pill">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </NextLink>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

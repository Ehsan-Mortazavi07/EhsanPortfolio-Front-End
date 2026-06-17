"use client";

import { ArrowUp2 } from "iconsax-reactjs";
import { RemoteImage } from "@/components/common/media";
import NextLink from "next/link";
import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ProjectDto, SiteSettingsDto } from "@/common/interfaces";
import { resolvePublicUploadUrl } from "@/common/utils";

type Props = { projects: ProjectDto[]; settings: SiteSettingsDto };

export function ProjectsPage({ projects, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("hero.portfolio")}
          title={t("projects.pageTitle")}
          subtitle={t("projects.pageSubtitle")}
        />
      }
    >
      <div className="section-container py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const title = l(project.title, project.titleFa);
            const cover = resolvePublicUploadUrl(project.coverImageUrl);

            return (
              <NextLink key={project.id} href={PATHS.PROJECT(project.slug)} className="group block">
                <div className="green-card flex h-full flex-col overflow-hidden !p-0">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--card-border)]">
                    {cover ? (
                      <RemoteImage src={cover} alt={title} fill className="object-cover transition group-hover:scale-105" sizes="400px" />
                    ) : (
                      <div className="image-placeholder size-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold uppercase tracking-tight group-hover:underline">{title}</h2>
                      <ArrowUp2 size={16} className="text-foreground/35" />
                    </div>
                    <p className="mt-2 text-sm text-foreground/65">{l(project.excerpt, project.excerptFa)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </NextLink>
            );
          })}
        </div>
      </div>
    </PublicPageLayout>
  );
}

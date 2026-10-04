"use client";

import { ArrowUp2, ExportSquare } from "iconsax-reactjs";
import { RemoteImage } from "@/components/common/media";
import NextLink from "next/link";
import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ProjectDto, SiteSettingsDto } from "@/common/interfaces";
import { isSafeExternalUrl, resolvePageSubtitle, resolvePublicUploadUrl } from "@/common/utils";

type Props = { projects: ProjectDto[]; settings: SiteSettingsDto };

export function ProjectsPage({ projects, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const subtitle = resolvePageSubtitle(settings, "projects", l, t, "projects.pageSubtitle");

  return (
    <PublicPageLayout
      settings={settings}
      hero={
        <PageHeroBand
          label={t("hero.portfolio")}
          title={t("projects.pageTitle")}
          subtitle={subtitle}
        />
      }
    >
      <div className="section-container py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const title = l(project.title, project.titleFa);
            const cover = resolvePublicUploadUrl(project.coverImageUrl);
            const liveUrl = isSafeExternalUrl(project.liveUrl) ? project.liveUrl : null;
            const detailUrl = PATHS.PROJECT(project.slug);

            return (
              <div key={project.id} className="group green-card flex h-full flex-col overflow-hidden !p-0">
                <NextLink href={detailUrl} aria-label={`${t("projects.seeDetails")}: ${title}`} className="relative block aspect-[16/10] overflow-hidden bg-[var(--card-border)]">
                    {cover ? (
                      <RemoteImage src={cover} alt={title} fill className="object-cover transition group-hover:scale-105" sizes="400px" />
                    ) : (
                      <div className="image-placeholder size-full" />
                    )}
                </NextLink>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold uppercase tracking-tight">
                      {liveUrl ? (
                        <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="group-hover:underline">
                          {title}
                        </a>
                      ) : (
                        <NextLink href={detailUrl} className="group-hover:underline">{title}</NextLink>
                      )}
                    </h2>
                    {liveUrl ? <ExportSquare size={16} className="text-foreground/35" aria-hidden="true" /> : <ArrowUp2 size={16} className="text-foreground/35" />}
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
            );
          })}
        </div>
      </div>
    </PublicPageLayout>
  );
}

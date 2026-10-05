"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { ArrowLeft2, ArrowRight2, ExportSquare, ProgrammingArrow } from "iconsax-reactjs";
import { RemoteImage } from "@/components/common/media";
import NextLink from "next/link";
import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ProjectDto, SiteSettingsDto } from "@/common/interfaces";
import { isSafeExternalUrl, resolvePublicUploadUrl } from "@/common/utils";

type Props = { project: ProjectDto; settings: SiteSettingsDto };

export function ProjectDetailPage({ project, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryScroll, setGalleryScroll] = useState({ canGoPrevious: false, canGoNext: false });
  const cover = resolvePublicUploadUrl(project.coverImageUrl);
  const bodyHtml = l(project.contentHtml, project.contentHtmlFa);
  const isPortfolio = project.slug === "portfolio-platform";
  const galleryImages = [...new Set(project.gallery ?? [])]
    .filter((image) => image && image !== project.coverImageUrl)
    .map((image) => resolvePublicUploadUrl(image))
    .filter((image): image is string => Boolean(image));

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const updateScrollState = () => {
      const maxScrollLeft = gallery.scrollWidth - gallery.clientWidth;
      setGalleryScroll({
        canGoPrevious: gallery.scrollLeft > 1,
        canGoNext: gallery.scrollLeft < maxScrollLeft - 1,
      });
    };

    updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(gallery);
    return () => resizeObserver.disconnect();
  }, [galleryImages.length]);

  function scrollGallery(direction: "previous" | "next") {
    const gallery = galleryRef.current;
    if (!gallery) return;

    gallery.scrollBy({
      left: (direction === "previous" ? -1 : 1) * Math.max(240, gallery.clientWidth * 0.85),
      behavior: "smooth",
    });
  }

  return (
    <PublicPageLayout
      settings={settings}
      hero={<PageHeroBand label={t("projects.label")} title={l(project.title, project.titleFa)} />}
    >
      <article className="project-detail section-container max-w-3xl py-16">
        <NextLink href={PATHS.PROJECTS} className="detail-back-link">
          {t("projects.back")}
        </NextLink>

        {cover ? (
          <div className={`project-detail-cover relative mt-8 aspect-[16/10] overflow-hidden ${isPortfolio ? "bg-[#071a15]" : ""}`}>
            <RemoteImage
              src={cover}
              alt={l(project.title, project.titleFa)}
              fill
              quality={100}
              className={isPortfolio ? "object-contain" : "object-cover"}
              sizes="768px"
              priority
            />
          </div>
        ) : null}

        {galleryImages.length > 0 ? (
          <section className="mt-8" aria-label={t("projects.gallery")}>
            <h2 className="mb-4 text-xl font-semibold">{t("projects.gallery")}</h2>
            <div className="flex items-center gap-2" dir="ltr">
              {galleryImages.length > 1 ? (
                <Button
                  isIconOnly
                  variant="secondary"
                  aria-label={t("projects.galleryPrevious")}
                  isDisabled={!galleryScroll.canGoPrevious}
                  onPress={() => scrollGallery("previous")}
                  className="shrink-0 rounded-full"
                >
                  <ArrowLeft2 size={20} variant="Linear" />
                </Button>
              ) : null}
              <div
                ref={galleryRef}
                className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4"
                role="list"
                tabIndex={0}
                onScroll={() => {
                  const gallery = galleryRef.current;
                  if (!gallery) return;
                  const maxScrollLeft = gallery.scrollWidth - gallery.clientWidth;
                  setGalleryScroll({
                    canGoPrevious: gallery.scrollLeft > 1,
                    canGoNext: gallery.scrollLeft < maxScrollLeft - 1,
                  });
                }}
              >
                {galleryImages.map((image, index) => (
                  <div
                    key={image}
                    role="listitem"
                    className="relative aspect-[16/10] w-[min(82vw,23rem)] shrink-0 snap-start overflow-hidden rounded-2xl bg-[var(--tag-bg)] ring-1 ring-[var(--card-border)]"
                  >
                    <RemoteImage
                      src={image}
                      alt={`${l(project.title, project.titleFa)} ${index + 1}`}
                      fill
                      quality={100}
                      className="object-contain"
                      sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ))}
              </div>
              {galleryImages.length > 1 ? (
                <Button
                  isIconOnly
                  variant="secondary"
                  aria-label={t("projects.galleryNext")}
                  isDisabled={!galleryScroll.canGoNext}
                  onPress={() => scrollGallery("next")}
                  className="shrink-0 rounded-full"
                >
                  <ArrowRight2 size={20} variant="Linear" />
                </Button>
              ) : null}
            </div>
          </section>
        ) : null}

        <p className="project-detail-lead mt-8">{l(project.excerpt, project.excerptFa)}</p>

        {project.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {bodyHtml ? (
          <div className="prose-portfolio mt-10" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        ) : (
          <div className="prose-portfolio mt-10">
            <p>{l(project.description, project.descriptionFa)}</p>
          </div>
        )}

        <div className="project-detail-actions mt-10 flex flex-wrap gap-3">
          {isSafeExternalUrl(project.liveUrl) && (
            <Button variant="primary" className="rounded-full font-semibold" onPress={() => window.open(project.liveUrl!, "_blank", "noopener,noreferrer")}>
              <ExportSquare size={16} variant="Linear" /> {t("projects.viewSite")}
            </Button>
          )}
          {isSafeExternalUrl(project.repoUrl) && (
            <Button variant="secondary" className="rounded-full font-semibold" onPress={() => window.open(project.repoUrl!, "_blank", "noopener,noreferrer")}>
              <ProgrammingArrow size={16} variant="Linear" /> {t("projects.sourceCode")}
            </Button>
          )}
        </div>
      </article>
    </PublicPageLayout>
  );
}

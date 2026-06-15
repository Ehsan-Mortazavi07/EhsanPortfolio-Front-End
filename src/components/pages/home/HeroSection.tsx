"use client";

import { ArrowDown2, DocumentDownload } from "iconsax-reactjs";
import { motion } from "motion/react";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ProjectDto, SiteSettingsDto } from "@/common/interfaces";
import { heroTitleLines } from "@/common/utils/hero-title";
import { resolvePublicUploadUrl } from "@/common/utils";

type Props = {
  settings: SiteSettingsDto;
  projects: ProjectDto[];
};

type Thumb = {
  id: string;
  slug?: string;
  src: string;
  alt: string;
};

const FALLBACK_THUMBS = [
  "/images/hero/thumb-plant.svg",
  "/images/hero/thumb-vases.svg",
  "/images/hero/thumb-dome.svg",
];

export function HeroSection({ settings, projects }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const router = useRouter();

  const title = l(settings.heroTitle, settings.heroTitleFa);
  const lines = heroTitleLines(title);
  const cvHref = resolvePublicUploadUrl(settings.cvUrl);

  const thumbs: Thumb[] =
    projects.length > 0
      ? projects.slice(0, 3).map((project) => {
          const raw = project.coverImageUrl;
          const src = resolvePublicUploadUrl(raw) || FALLBACK_THUMBS[0];
          return {
            id: project.id,
            slug: project.slug,
            src,
            alt: l(project.title, project.titleFa),
          };
        })
      : FALLBACK_THUMBS.map((src, index) => ({
          id: `fallback-${index}`,
          src,
          alt: t("hero.seePortfolio"),
        }));

  function goToServices() {
    router.push(PATHS.SERVICES);
  }

  return (
    <section className="hero-section">
      <div className="hero-atmosphere" aria-hidden />
      <div className="hero-pillars" aria-hidden />
      <div className="hero-mist" aria-hidden />

      <div className="hero-content flex flex-1 flex-col items-center justify-center px-4 pb-52 pt-28 text-center sm:px-6 sm:pb-56 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-badge mb-8"
        >
          <span className="hero-badge-dot" />
          {t("hero.available")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="hero-headline max-w-5xl"
        >
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="hero-subline"
        >
          {l(settings.heroBio, settings.heroBioFa)}
        </motion.p>

        {cvHref ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-10"
          >
            <a href={cvHref} className="pill-cta" download target="_blank" rel="noreferrer">
              {t("hero.downloadCv")}
              <DocumentDownload size={15} variant="Linear" />
            </a>
          </motion.div>
        ) : null}
      </div>

      <div className="hero-gallery">
        {thumbs.map((thumb, index) => {
          const isCenter = index === 1;
          const className = `portfolio-thumb ${isCenter ? "portfolio-thumb-center" : "portfolio-thumb-side"}`;
          const image = (
            <div className={className}>
              <Image src={thumb.src} alt={thumb.alt} fill className="object-cover" sizes="140px" priority={isCenter} />
            </div>
          );

          if (thumb.slug) {
            return (
              <NextLink key={thumb.id} href={PATHS.PROJECT(thumb.slug)}>
                {image}
              </NextLink>
            );
          }
          return <div key={thumb.id}>{image}</div>;
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.32 }}
        className="hero-footer"
      >
        <NextLink href={PATHS.PROJECTS} className="hero-footer-link hidden sm:inline-block">
          {t("hero.seePortfolio")}
        </NextLink>
        <span className="sm:hidden" />

        <button type="button" onClick={goToServices} className="flex items-center gap-3">
          <span className="hero-footer-link hidden sm:inline">{t("hero.scrollDown")}</span>
          <span className="scroll-pill">
            <ArrowDown2 size={18} variant="Linear" />
          </span>
        </button>
      </motion.div>
    </section>
  );
}

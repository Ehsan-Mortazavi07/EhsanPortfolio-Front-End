"use client";

import NextLink from "next/link";
import { PublicPageLayout } from "@/components/common/shell";
import { SkillLogo } from "@/components/common/skills/SkillLogo";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ExperienceDto, SiteSettingsDto, SkillDto } from "@/common/interfaces";
import { resolvePublicUploadUrl } from "@/common/utils";

type Props = {
  settings: SiteSettingsDto;
  experience: ExperienceDto[];
  skills: SkillDto[];
};

const PORTRAIT_FALLBACK = "/images/hero-portrait.svg";

function AboutIntro({ settings }: { settings: SiteSettingsDto }) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const portrait = resolvePublicUploadUrl(settings.heroPortraitUrl) || PORTRAIT_FALLBACK;
  const subtitle = l(settings.heroSubtitle, settings.heroSubtitleFa);

  return (
    <section className="about-intro">
      <div className="section-container about-hero-stage">
        <div className="about-hero-copy">
          <p className="about-hero-label">{t("nav.about")}</p>
          <h1 className="about-hero-title">{t("about.title")}</h1>
          {subtitle ? <p className="about-hero-tagline">{subtitle}</p> : null}
        </div>

        <figure className="about-hero-portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portrait} alt={t("about.portraitAlt")} className="about-hero-portrait-img" />
        </figure>
      </div>
    </section>
  );
}

export function AboutPage({ settings, experience, skills }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();

  return (
    <PublicPageLayout settings={settings}>
      <AboutIntro settings={settings} />
      <div className="section-container max-w-3xl py-16">
        <p className="text-lg leading-relaxed text-[var(--content-fg-muted)]">{l(settings.heroBio, settings.heroBioFa)}</p>

        <h2 className="mt-16 text-2xl font-extrabold uppercase tracking-tight">{t("about.experience")}</h2>
        <div className="mt-6 space-y-6">
          {experience.map((item) => (
            <div key={item.id} className="green-card !p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--content-fg-muted)]">{l(item.period, item.periodFa)}</p>
              <p className="mt-2 font-bold">{l(item.role, item.roleFa)} — {l(item.company, item.companyFa)}</p>
              <p className="mt-2 text-sm text-[var(--content-fg-muted)]">{l(item.description, item.descriptionFa)}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-extrabold uppercase tracking-tight">{t("about.skills")}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <SkillLogo skill={skill} />
              <p className="skill-card-name">{skill.name}</p>
              <p className="skill-card-category">{skill.category}</p>
            </div>
          ))}
        </div>

        <div className="green-card mt-16">
          <p className="font-semibold">{t("about.getInTouch")}</p>
          <p className="mt-2 text-sm text-[var(--content-fg-muted)]">{settings.email}</p>
          <NextLink href={PATHS.CONTACT} className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide hover:underline">
            {t("about.contactForm")}
          </NextLink>
        </div>
      </div>
    </PublicPageLayout>
  );
}

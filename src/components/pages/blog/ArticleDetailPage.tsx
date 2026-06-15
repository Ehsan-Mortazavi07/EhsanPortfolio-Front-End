"use client";

import { Link } from "@heroui/react";
import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { PATHS } from "@/common/constants";
import { useTranslation, useLocale } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import type { ArticleDetailDto, SiteSettingsDto } from "@/common/interfaces";

type Props = { article: ArticleDetailDto; settings: SiteSettingsDto };

export function ArticleDetailPage({ article, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const locale = useLocale();
  const dateLocale = locale === "fa" ? "fa-IR" : "en-US";
  const content = l(article.contentHtml, article.contentHtmlFa);

  return (
    <PublicPageLayout
      settings={settings}
      hero={<PageHeroBand label={t("nav.blog")} title={l(article.title, article.titleFa)} />}
    >
      <article className="section-container max-w-3xl py-16">
        <Link href={PATHS.BLOG} className="text-sm font-semibold uppercase tracking-wide text-foreground/60">
          {t("blog.back")}
        </Link>
        <p className="mt-6 text-sm text-foreground/50">
          {new Date(article.publishedAt).toLocaleDateString(dateLocale)}
        </p>
        <p className="mt-2 text-lg text-foreground/65">{l(article.excerpt, article.excerptFa)}</p>
        <div className="prose-portfolio mt-10" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </PublicPageLayout>
  );
}

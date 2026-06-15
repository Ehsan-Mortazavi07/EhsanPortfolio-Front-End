"use client";

import NextLink from "next/link";
import { PageHeroBand, PublicPageLayout } from "@/components/common/shell";
import { PATHS } from "@/common/constants";
import { useTranslation } from "@/common/i18n/useTranslation";
import { useLocalizedText } from "@/common/i18n/useLocalizedText";
import { useLocale } from "@/common/i18n/useTranslation";
import type { ArticleListItemDto, SiteSettingsDto } from "@/common/interfaces";

type Props = { articles: ArticleListItemDto[]; settings: SiteSettingsDto };

export function BlogPage({ articles, settings }: Props) {
  const { t } = useTranslation();
  const l = useLocalizedText();
  const locale = useLocale();
  const dateLocale = locale === "fa" ? "fa-IR" : "en-US";

  return (
    <PublicPageLayout
      settings={settings}
      hero={<PageHeroBand label={t("nav.blog")} title={t("blog.title")} />}
    >
      <div className="section-container py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <NextLink key={article.id} href={PATHS.ARTICLE(article.slug)} className="group block">
              <div className="green-card h-full">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                  {new Date(article.publishedAt).toLocaleDateString(dateLocale)}
                </p>
                <h2 className="mt-3 text-xl font-bold uppercase tracking-tight group-hover:underline">
                  {l(article.title, article.titleFa)}
                </h2>
                <p className="mt-3 text-sm text-foreground/65">{l(article.excerpt, article.excerptFa)}</p>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider">{t("blog.readMore")}</span>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </PublicPageLayout>
  );
}

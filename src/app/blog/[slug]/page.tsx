import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchSiteSettings } from "@/common/api/catalog";
import { ArticleDetailPage } from "@/components/pages/blog/ArticleDetailPage";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  return { title: article?.title ?? "Article" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([fetchArticleBySlug(slug), fetchSiteSettings()]);
  if (!article) notFound();
  return <ArticleDetailPage article={article} settings={settings} />;
}

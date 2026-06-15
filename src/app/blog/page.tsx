import { fetchArticles, fetchSiteSettings } from "@/common/api/catalog";
import { BlogPage } from "@/components/pages/blog/BlogPage";

export const metadata = { title: "Blog" };

export default async function Page() {
  const [articlesResult, settings] = await Promise.all([
    fetchArticles({ pageSize: 50 }),
    fetchSiteSettings(),
  ]);
  return <BlogPage articles={articlesResult.items} settings={settings} />;
}

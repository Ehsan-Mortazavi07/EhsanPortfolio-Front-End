import { notFound } from "next/navigation";
import { fetchProjectBySlug, fetchSiteSettings } from "@/common/api/catalog";
import { ProjectDetailPage } from "@/components/pages/projects/ProjectDetailPage";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);
  return { title: project?.title ?? "Project" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [project, settings] = await Promise.all([fetchProjectBySlug(slug), fetchSiteSettings()]);
  if (!project) notFound();
  return <ProjectDetailPage project={project} settings={settings} />;
}

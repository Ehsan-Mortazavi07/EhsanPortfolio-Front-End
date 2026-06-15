import { fetchProjects, fetchSiteSettings } from "@/common/api/catalog";
import { ProjectsPage } from "@/components/pages/projects/ProjectsPage";

export const metadata = { title: "Projects" };

export default async function Page() {
  const [projectsResult, settings] = await Promise.all([
    fetchProjects({ pageSize: 50 }),
    fetchSiteSettings(),
  ]);
  return <ProjectsPage projects={projectsResult.items} settings={settings} />;
}

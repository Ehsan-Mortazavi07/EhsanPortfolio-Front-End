import { fetchExperience, fetchSiteSettings } from "@/common/api/catalog";
import { ExperiencePage } from "@/components/pages/experience/ExperiencePage";

export const metadata = { title: "Experience" };

export default async function Page() {
  const [experience, settings] = await Promise.all([fetchExperience(), fetchSiteSettings()]);
  return <ExperiencePage experience={experience} settings={settings} />;
}

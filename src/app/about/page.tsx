import { fetchExperience, fetchSiteSettings, fetchSkills } from "@/common/api/catalog";
import { AboutPage } from "@/components/pages/about/AboutPage";

export const metadata = { title: "About" };

export default async function Page() {
  const [settings, experience, skills] = await Promise.all([
    fetchSiteSettings(),
    fetchExperience(),
    fetchSkills(),
  ]);
  return <AboutPage settings={settings} experience={experience} skills={skills} />;
}

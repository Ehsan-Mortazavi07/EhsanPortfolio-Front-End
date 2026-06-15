import {
  fetchExperience,
  fetchProjects,
  fetchServices,
  fetchSiteSettings,
  fetchSkills,
  fetchTestimonials,
} from "@/common/api/catalog";
import { HomePage } from "@/components/pages/home/HomePage";

export default async function Page() {
  const [settings, services, experience, projectsResult, skills, testimonials] = await Promise.all([
    fetchSiteSettings(),
    fetchServices(),
    fetchExperience(),
    fetchProjects({ pageSize: 6 }),
    fetchSkills(),
    fetchTestimonials(),
  ]);

  return (
    <HomePage
      settings={settings}
      services={services}
      experience={experience}
      projects={projectsResult.items}
      skills={skills}
      testimonials={testimonials}
    />
  );
}

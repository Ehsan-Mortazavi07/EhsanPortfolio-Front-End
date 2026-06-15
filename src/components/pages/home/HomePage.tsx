import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import { PublicShell } from "@/components/common/shell";
import { ExperienceSection } from "@/components/pages/home/ExperienceSection";
import { HeroSection } from "@/components/pages/home/HeroSection";
import { ProjectsSection } from "@/components/pages/home/ProjectsSection";
import { ServicesSection } from "@/components/pages/home/ServicesSection";
import { SkillsSection } from "@/components/pages/home/SkillsSection";
import { TestimonialsSection } from "@/components/pages/home/TestimonialsSection";
import type {
  ExperienceDto,
  ProjectDto,
  ServiceDto,
  SiteSettingsDto,
  SkillDto,
  TestimonialDto,
} from "@/common/interfaces";

type Props = {
  settings: SiteSettingsDto;
  services: ServiceDto[];
  experience: ExperienceDto[];
  projects: ProjectDto[];
  skills: SkillDto[];
  testimonials: TestimonialDto[];
};

export function HomePage({ settings, services, experience, projects, skills, testimonials }: Props) {
  return (
    <PublicShell>
      <Navbar variant="hero" />
      <main>
        <HeroSection settings={settings} projects={projects} />
        <div className="content-light">
          <ServicesSection services={services} />
          <ExperienceSection experience={experience} />
          <ProjectsSection projects={projects} />
          <SkillsSection skills={skills} />
          <TestimonialsSection testimonials={testimonials} />
        </div>
      </main>
      <Footer settings={settings} />
    </PublicShell>
  );
}

import { fetchSiteSettings, fetchTestimonials } from "@/common/api/catalog";
import { TestimonialsPage } from "@/components/pages/testimonials/TestimonialsPage";

export const metadata = { title: "Reviews" };

export default async function Page() {
  const [testimonials, settings] = await Promise.all([fetchTestimonials(), fetchSiteSettings()]);
  return <TestimonialsPage testimonials={testimonials} settings={settings} />;
}

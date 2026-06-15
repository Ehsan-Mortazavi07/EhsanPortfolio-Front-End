import { fetchServices, fetchSiteSettings } from "@/common/api/catalog";
import { ServicesPage } from "@/components/pages/services/ServicesPage";

export const metadata = { title: "Services" };

export default async function Page() {
  const [services, settings] = await Promise.all([fetchServices(), fetchSiteSettings()]);
  return <ServicesPage services={services} settings={settings} />;
}

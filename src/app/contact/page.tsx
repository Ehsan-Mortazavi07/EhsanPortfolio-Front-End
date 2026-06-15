import { fetchSiteSettings } from "@/common/api/catalog";
import { ContactPage } from "@/components/pages/contact/ContactPage";

export const metadata = { title: "Contact" };

export default async function Page() {
  const settings = await fetchSiteSettings();
  return <ContactPage settings={settings} />;
}

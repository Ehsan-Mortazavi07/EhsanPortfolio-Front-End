import { fetchSiteSettings } from "@/common/api/catalog";
import { SEED_SETTINGS } from "@/common/data/seed";
import { NotFoundPage } from "@/components/pages/not-found/NotFoundPage";

export default async function NotFound() {
  let settings = SEED_SETTINGS;
  try {
    settings = await fetchSiteSettings();
  } catch {
    // fallback seed for footer links
  }
  return <NotFoundPage settings={settings} />;
}

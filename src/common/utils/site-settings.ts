import { SEED_SETTINGS } from "@/common/data/seed";
import type { SiteSettingsDto } from "@/common/interfaces";

function socialOrSeed(
  value: string | null | undefined,
  seed: string | null | undefined,
): string | null {
  if (value === undefined || value === null) return seed ?? null;
  const trimmed = value.trim();
  return trimmed || null;
}

/** Fills missing social URLs from seed so footer icons always render when DB is older. */
export function withSocialDefaults(settings: SiteSettingsDto): SiteSettingsDto {
  return {
    ...settings,
    githubUrl: socialOrSeed(settings.githubUrl, SEED_SETTINGS.githubUrl),
    linkedinUrl: socialOrSeed(settings.linkedinUrl, SEED_SETTINGS.linkedinUrl),
    telegramUrl: socialOrSeed(settings.telegramUrl, SEED_SETTINGS.telegramUrl),
    instagramUrl: socialOrSeed(settings.instagramUrl, SEED_SETTINGS.instagramUrl),
  };
}

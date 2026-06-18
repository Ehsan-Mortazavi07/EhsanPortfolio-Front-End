import type { MessageKey } from "@/common/i18n/types";
import type { PageSubtitleKey, SiteSettingsDto } from "@/common/interfaces";

type LocalizedFn = (en?: string | null, fa?: string | null) => string;
type TranslateFn = (key: MessageKey) => string;

export function resolvePageSubtitle(
  settings: SiteSettingsDto | undefined,
  page: PageSubtitleKey,
  l: LocalizedFn,
  t: TranslateFn,
  fallbackKey: MessageKey,
): string {
  const custom = settings?.pageSubtitles?.[page];
  const text = l(custom?.subtitle, custom?.subtitleFa);
  return text || t(fallbackKey);
}

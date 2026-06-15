"use client";

import { Mail } from "lucide-react";
import type { SiteSettingsDto } from "@/common/interfaces";
import { withSocialDefaults } from "@/common/utils/site-settings";
import { SocialLinks } from "@/components/common/social/SocialLinks";

type Props = { settings: SiteSettingsDto };

export function SocialBar({ settings }: Props) {
  const socialSettings = withSocialDefaults(settings);

  return (
    <section className="border-b border-border/40 py-8">
      <div className="section-container flex flex-wrap items-center justify-center gap-6">
        <SocialLinks settings={socialSettings} variant="labeled" />
        <a href={`mailto:${settings.email}`} className="social-link-labeled">
          <Mail className="size-4" />
          <span>Email</span>
        </a>
      </div>
    </section>
  );
}

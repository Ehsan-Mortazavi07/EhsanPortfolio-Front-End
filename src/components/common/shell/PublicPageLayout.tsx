"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { Footer } from "@/components/common/footer";
import { Navbar } from "@/components/common/navbar";
import { PublicShell } from "@/components/common/shell";
import type { SiteSettingsDto } from "@/common/interfaces";

type Props = PropsWithChildren<{
  settings: SiteSettingsDto;
  hero?: ReactNode;
}>;

export function PublicPageLayout({ children, settings, hero }: Props) {
  return (
    <PublicShell>
      <Navbar variant="inner" />
      <main>
        {hero}
        <div className="content-light">{children}</div>
      </main>
      <Footer settings={settings} />
    </PublicShell>
  );
}

type PageHeroProps = {
  label: string;
  title: string;
  subtitle?: string;
};

export function PageHeroBand({ label, title, subtitle }: PageHeroProps) {
  return (
    <div className="page-hero-band">
      <div className="section-container">
        <p className="section-label">{label}</p>
        <h1 className="section-title mt-3">{title}</h1>
        {subtitle ? <p className="hero-subline mt-4 max-w-2xl text-start sm:text-base">{subtitle}</p> : null}
      </div>
    </div>
  );
}

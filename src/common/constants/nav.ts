import { PATHS } from "./PATHS";

export type PublicNavItem = {
  href: string;
  labelKey:
    | "nav.home"
    | "nav.about"
    | "nav.services"
    | "nav.projects"
    | "nav.experience"
    | "nav.testimonials"
    | "nav.contact";
  match: (pathname: string) => boolean;
};

export const PUBLIC_NAV: PublicNavItem[] = [
  { href: PATHS.HOME, labelKey: "nav.home", match: (p) => p === PATHS.HOME },
  { href: PATHS.ABOUT, labelKey: "nav.about", match: (p) => p === PATHS.ABOUT },
  { href: PATHS.SERVICES, labelKey: "nav.services", match: (p) => p === PATHS.SERVICES },
  { href: PATHS.PROJECTS, labelKey: "nav.projects", match: (p) => p.startsWith("/projects") },
  { href: PATHS.EXPERIENCE, labelKey: "nav.experience", match: (p) => p === PATHS.EXPERIENCE },
  { href: PATHS.TESTIMONIALS, labelKey: "nav.testimonials", match: (p) => p === PATHS.TESTIMONIALS },
  { href: PATHS.CONTACT, labelKey: "nav.contact", match: (p) => p === PATHS.CONTACT },
];

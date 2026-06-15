import type {
  ArticleListItemDto,
  ExperienceDto,
  ProjectDto,
  ServiceDto,
  SiteSettingsDto,
  SkillDto,
  TestimonialDto,
} from "@/common/interfaces";

export const SEED_SETTINGS: SiteSettingsDto = {
  heroTitle: "Hello! I'm Ehsan Mortazavi",
  heroTitleFa: "سلام! من احسان مرتضوی هستم",
  heroSubtitle: "Full-Stack Developer",
  heroSubtitleFa: "توسعه‌دهنده فول‌استک",
  heroBio:
    "I craft scalable web applications with clean architecture, modern stacks, and a relentless focus on performance and developer experience.",
  heroBioFa:
    "اپلیکیشن‌های وب مقیاس‌پذیر با معماری تمیز، استک‌های مدرن و تمرکز بر عملکرد و تجربه توسعه می‌سازم.",
  heroPortraitUrl: "/images/hero-portrait.svg",
  cvUrl: "/cv/ehsan-mortazavi-cv.pdf",
  email: "hello@ehsanmortazavi.dev",
  phone: null,
  location: "Remote · Worldwide",
  githubUrl: "https://github.com/ehsanmortazavi",
  linkedinUrl: "https://linkedin.com/in/ehsanmortazavi",
  telegramUrl: "https://t.me/ehsanmortazavi",
  instagramUrl: "https://instagram.com/ehsanmortazavi",
  twitterUrl: null,
};

export const SEED_SERVICES: ServiceDto[] = [
  {
    id: "1",
    slug: "full-stack",
    title: "Full-Stack Development",
    description: "End-to-end product engineering with NestJS, React, and cloud-native deployment.",
    icon: "code",
    highlighted: true,
    sortOrder: 0,
  },
  {
    id: "2",
    slug: "architecture",
    title: "System Architecture",
    description: "Scalable microservices, API design, and database modeling for growing teams.",
    icon: "layers",
    highlighted: false,
    sortOrder: 1,
  },
  {
    id: "3",
    slug: "consulting",
    title: "Technical Consulting",
    description: "Code reviews, performance audits, and mentoring for engineering teams.",
    icon: "lightbulb",
    highlighted: false,
    sortOrder: 2,
  },
];

export const SEED_EXPERIENCE: ExperienceDto[] = [
  {
    id: "1",
    slug: "senior-fullstack",
    company: "Tech Studio",
    role: "Senior Full-Stack Developer",
    period: "2022 — Present",
    description: "Leading development of SaaS platforms with NestJS and Next.js.",
    current: true,
    sortOrder: 0,
  },
  {
    id: "2",
    slug: "fullstack-dev",
    company: "Digital Agency",
    role: "Full-Stack Developer",
    period: "2019 — 2022",
    description: "Built client projects across e-commerce, dashboards, and mobile backends.",
    current: false,
    sortOrder: 1,
  },
];

export const SEED_PROJECTS: ProjectDto[] = [
  {
    id: "1",
    slug: "portfolio-platform",
    title: "Portfolio Platform",
    excerpt: "A minimalist developer portfolio with admin CMS.",
    description: "Full-stack portfolio with Next.js frontend and NestJS API.",
    coverImageUrl: null,
    tags: ["Next.js", "NestJS", "MongoDB"],
    featured: true,
    sortOrder: 0,
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "2",
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    excerpt: "Real-time metrics dashboard for product teams.",
    description: "React dashboard with WebSocket live updates.",
    coverImageUrl: null,
    tags: ["React", "PostgreSQL", "Redis"],
    featured: false,
    sortOrder: 1,
    liveUrl: "#",
    repoUrl: "#",
  },
  {
    id: "3",
    slug: "api-gateway",
    title: "API Gateway",
    excerpt: "High-performance API gateway with rate limiting.",
    description: "NestJS microservices gateway with JWT auth.",
    coverImageUrl: null,
    tags: ["NestJS", "TypeScript", "Docker"],
    featured: false,
    sortOrder: 2,
    liveUrl: null,
    repoUrl: "#",
  },
];

export const SEED_SKILLS: SkillDto[] = [
  { id: "1", slug: "nestjs", name: "NESTJS", category: "backend", sortOrder: 0 },
  { id: "2", slug: "react", name: "REACT", category: "frontend", sortOrder: 1 },
  { id: "3", slug: "nextjs", name: "NEXTJS", category: "frontend", sortOrder: 2 },
  { id: "4", slug: "postgresql", name: "POSTGRESQL", category: "database", sortOrder: 3 },
  { id: "5", slug: "mongodb", name: "MONGODB", category: "database", sortOrder: 4 },
  { id: "6", slug: "typescript", name: "TYPESCRIPT", category: "language", sortOrder: 5 },
];

export const SEED_TESTIMONIALS: TestimonialDto[] = [
  {
    id: "1",
    slug: "client-one",
    name: "Sarah Chen",
    role: "CTO",
    company: "Startup Inc",
    content: "Ehsan delivered a rock-solid platform on time. Exceptional architecture skills.",
    avatarUrl: null,
    sortOrder: 0,
  },
];

export const SEED_ARTICLES: ArticleListItemDto[] = [
  {
    id: "1",
    slug: "scalable-nestjs",
    title: "Building Scalable APIs with NestJS",
    excerpt: "Patterns for modular, testable backend services.",
    coverImageUrl: null,
    publishedAt: "2025-01-15T00:00:00.000Z",
  },
];

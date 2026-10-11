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
    id: "portfolio-platform",
    slug: "portfolio-platform",
    title: "Ehsan Mortazavi Portfolio",
    titleFa: "پورتفولیوی احسان مرتضوی",
    excerpt: "A bilingual developer portfolio with a custom content management workspace.",
    excerptFa: "پورتفولیوی دوزبانه با پنل اختصاصی برای مدیریت محتوا و نمونه‌کارها.",
    description: "A full-stack portfolio for presenting work and managing projects, articles, skills, and contact messages.",
    descriptionFa: "یک پورتفولیوی فول‌استک برای نمایش نمونه‌کارها و مدیریت پروژه‌ها، مقاله‌ها، مهارت‌ها و پیام‌های تماس.",
    contentHtml: "<p>A bilingual portfolio built with a Next.js frontend and a NestJS API. Its admin workspace manages projects, services, experience, skills, articles, testimonials, and moderated contact messages.</p><p>The project supports Persian and English, responsive layouts, theme switching, image uploads, and public case-study pages.</p>",
    contentHtmlFa: "<p>یک پورتفولیوی دوزبانه با فرانت‌اند Next.js و API مبتنی بر NestJS. پنل مدیریت آن برای مدیریت پروژه‌ها، خدمات، سوابق کاری، مهارت‌ها، مقاله‌ها، دیدگاه‌ها و پیام‌های تماس با امکان تأیید طراحی شده است.</p><p>این پروژه از فارسی و انگلیسی، چیدمان واکنش‌گرا، تغییر پوسته، بارگذاری تصویر و صفحهٔ جزئیات نمونه‌کار پشتیبانی می‌کند.</p>",
    coverImageUrl: "/images/projects/portfolio-platform-cover.png",
    homeImageUrl: "/images/projects/portfolio-home.png",
    tags: ["Next.js", "NestJS", "MongoDB", "TypeScript"],
    featured: true,
    sortOrder: 1,
    liveUrl: "https://ehsanmor.ir",
    repoUrl: null,
  },
  {
    id: "hatefaroma",
    slug: "hatefaroma",
    title: "HatefAroma",
    titleFa: "هاتف آروما",
    excerpt: "A Persian luxury fragrance and beauty store with product discovery and a dedicated VIP club.",
    excerptFa: "فروشگاه آنلاین عطر و محصولات لوکس بهداشتی با جست‌وجوی تخصصی و باشگاه مشتریان VIP.",
    description: "A bilingual commerce platform for niche fragrances and beauty products, with curated collections, online checkout, and customer membership features.",
    descriptionFa: "فروشگاه دوزبانهٔ عطرهای نیش و محصولات بهداشتی لوکس، با مجموعه‌های منتخب، پرداخت آنلاین و امکانات باشگاه مشتریان.",
    contentHtml: "<p>HatefAroma is a full-stack commerce platform for niche fragrances and premium beauty products. The storefront supports product discovery, dynamic product attributes, cart and checkout flows, and a dedicated VIP membership experience.</p><p>The project includes a Persian-first RTL interface, an English locale, and an administration workspace for catalog, orders, customers, and homepage content.</p>",
    contentHtmlFa: "<p>HatefAroma یک پلتفرم فول‌استک برای فروش عطرهای نیش و محصولات بهداشتی لوکس است. فروشگاه از جست‌وجو و دسته‌بندی محصولات، ویژگی‌های پویا، سبد خرید، پرداخت و تجربهٔ اختصاصی عضویت VIP پشتیبانی می‌کند.</p><p>این پروژه رابط فارسی راست‌چین، زبان انگلیسی و پنل مدیریت کاتالوگ، سفارش‌ها، کاربران و محتوای صفحهٔ اصلی را دارد.</p>",
    coverImageUrl: "/images/projects/hatefaroma-home.png",
    homeImageUrl: "/images/projects/hatefaroma-home.png",
    tags: ["Next.js", "NestJS", "MongoDB", "VIP Commerce"],
    featured: true,
    sortOrder: 2,
    liveUrl: "https://hatefaroma.ehsanmor.ir",
    repoUrl: null,
  },
  {
    id: "car-notebook",
    slug: "car-notebook",
    title: "Car Notebook",
    titleFa: "دفترچهٔ خودرو",
    excerpt: "A vehicle-care workspace for service history, mileage, and maintenance reminders.",
    excerptFa: "فضای مدیریت نگهداری خودرو برای ثبت سوابق سرویس، کیلومتر و یادآوری تعمیرات.",
    description: "A full-stack vehicle maintenance tracker that calculates service schedules from both mileage and time intervals.",
    descriptionFa: "سامانهٔ فول‌استک نگهداری خودرو که موعد سرویس را بر اساس کیلومتر و بازهٔ زمانی محاسبه می‌کند.",
    contentHtml: "<p>Car Notebook helps drivers keep vehicle records in one place: vehicles, odometer readings, maintenance rules, and service history.</p><p>Its dashboard shows upcoming service by distance and date, with reminders and a timeline of completed work. The interface is designed for Persian RTL use on desktop and mobile.</p>",
    contentHtmlFa: "<p>Car Notebook سوابق خودرو را یک‌جا نگه می‌دارد: مشخصات خودرو، کیلومترشمار، برنامهٔ نگهداری و تاریخچهٔ سرویس‌ها.</p><p>داشبورد موعد بعدی سرویس را بر اساس فاصلهٔ پیموده‌شده و تاریخ نشان می‌دهد و یادآوری‌ها و خط زمانی سرویس‌های انجام‌شده را در اختیار کاربر می‌گذارد. رابط آن برای استفادهٔ فارسی و راست‌چین در موبایل و دسکتاپ طراحی شده است.</p>",
    coverImageUrl: "/images/projects/car-notebook-dashboard.png",
    homeImageUrl: "/images/projects/car-notebook-dashboard.png",
    tags: ["Next.js", "NestJS", "MongoDB", "TypeScript"],
    featured: true,
    sortOrder: 3,
    liveUrl: null,
    repoUrl: null,
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

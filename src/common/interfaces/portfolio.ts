export interface ProjectDto {
  id: string;
  slug: string;
  title: string;
  titleFa?: string;
  excerpt: string;
  excerptFa?: string;
  description: string;
  descriptionFa?: string;
  contentHtml?: string;
  contentHtmlFa?: string;
  coverImageUrl: string | null;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  published?: boolean;
  liveUrl?: string | null;
  repoUrl?: string | null;
}

export interface ServiceDto {
  id: string;
  slug: string;
  title: string;
  titleFa?: string;
  description: string;
  descriptionFa?: string;
  icon: string;
  highlighted: boolean;
  sortOrder: number;
  published?: boolean;
}

export interface ExperienceDto {
  id: string;
  slug: string;
  company: string;
  companyFa?: string;
  role: string;
  roleFa?: string;
  period: string;
  periodFa?: string;
  description: string;
  descriptionFa?: string;
  current: boolean;
  sortOrder: number;
  published?: boolean;
}

export interface SkillDto {
  id: string;
  slug: string;
  name: string;
  category: string;
  sortOrder: number;
  published?: boolean;
}

export interface TestimonialDto {
  id: string;
  slug: string;
  name: string;
  role: string;
  company: string;
  content: string;
  contentFa?: string;
  avatarUrl: string | null;
  sortOrder: number;
  published?: boolean;
}

export interface ArticleListItemDto {
  id: string;
  slug: string;
  title: string;
  titleFa?: string;
  excerpt: string;
  excerptFa?: string;
  coverImageUrl: string | null;
  publishedAt: string;
  published?: boolean;
}

export interface ArticleDetailDto extends ArticleListItemDto {
  contentHtml: string;
  contentHtmlFa?: string;
}

export interface SiteSettingsDto {
  heroTitle: string;
  heroTitleFa?: string;
  heroSubtitle: string;
  heroSubtitleFa?: string;
  heroBio: string;
  heroBioFa?: string;
  heroPortraitUrl: string | null;
  cvUrl: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  telegramUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  aboutContent?: string;
  aboutContentFa?: string;
}

export interface ContactMessageDto {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ContactFormDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminDashboardStats {
  projects: number;
  services: number;
  experience: number;
  skills: number;
  testimonials: number;
  articles: number;
  contactMessages: number;
  unreadMessages: number;
}

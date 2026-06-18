import * as Yup from "yup";
import type {
  ExperienceDto,
  ProjectDto,
  ServiceDto,
  SiteSettingsDto,
  SkillDto,
  TestimonialDto,
} from "@/common/interfaces";

export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export const registerSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export const contactSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().min(10, "Min 10 characters").required("Message is required"),
});

export const slugSchema = Yup.string()
  .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens")
  .required("Slug is required");

export const projectFormSchema = Yup.object({
  slug: slugSchema,
  title: Yup.string().required("Title is required"),
  excerpt: Yup.string().required("Excerpt is required"),
  description: Yup.string().required("Description is required"),
  coverImageUrl: Yup.string().nullable(),
  tags: Yup.array().of(Yup.string()).default([]),
  featured: Yup.boolean().default(false),
  sortOrder: Yup.number().default(0),
  published: Yup.boolean().default(true),
  liveUrl: Yup.string().url("Invalid URL").nullable(),
  repoUrl: Yup.string().url("Invalid URL").nullable(),
});

export const serviceFormSchema = Yup.object({
  slug: slugSchema,
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  icon: Yup.string()
    .nullable()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .test("valid-icon", "Enter a valid image URL or upload a file", (v) => {
      if (!v) return true;
      if (v.startsWith("/")) return true;
      if (v.startsWith("http://") || v.startsWith("https://")) {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    }),
  highlighted: Yup.boolean().default(false),
  sortOrder: Yup.number().default(0),
  published: Yup.boolean().default(true),
});

export function toServicePayload(values: Omit<ServiceDto, "id"> & { id?: string }) {
  return {
    slug: values.slug,
    title: values.title,
    titleFa: values.titleFa ?? "",
    description: values.description,
    descriptionFa: values.descriptionFa ?? "",
    icon: values.icon?.trim() || "",
    highlighted: values.highlighted,
    sortOrder: values.sortOrder,
    published: values.published ?? true,
  };
}

export function toProjectPayload(values: Omit<ProjectDto, "id"> & { tagsInput?: string; published?: boolean }) {
  const tags =
    values.tagsInput !== undefined
      ? values.tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean)
      : values.tags;
  return {
    slug: values.slug,
    title: values.title,
    titleFa: values.titleFa ?? "",
    description: values.description || values.excerpt || "",
    descriptionFa: values.descriptionFa || values.excerptFa || "",
    coverImage: values.coverImageUrl ?? "",
    techStack: tags,
    featured: values.featured,
    sortOrder: values.sortOrder,
    published: values.published !== false,
    caseStudyUrl: values.liveUrl ?? "",
    githubUrl: values.repoUrl ?? "",
  };
}

export function toArticlePayload(values: {
  slug: string;
  title: string;
  titleFa?: string;
  excerpt: string;
  excerptFa?: string;
  contentHtml: string;
  contentHtmlFa?: string;
  coverImageUrl: string | null;
  publishedAt: string;
  published?: boolean;
}) {
  return {
    slug: values.slug,
    title: values.title,
    titleFa: values.titleFa ?? "",
    excerpt: values.excerpt,
    excerptFa: values.excerptFa ?? "",
    contentHtml: values.contentHtml,
    contentHtmlFa: values.contentHtmlFa ?? "",
    coverImage: values.coverImageUrl ?? "",
    publishedAt: new Date(values.publishedAt).toISOString(),
    published: values.published ?? true,
  };
}

export function toExperiencePayload(values: Omit<ExperienceDto, "id"> & { id?: string }) {
  return {
    company: values.company,
    companyFa: values.companyFa ?? "",
    role: values.role,
    roleFa: values.roleFa ?? "",
    duration: values.period,
    durationFa: values.periodFa ?? "",
    description: values.description,
    descriptionFa: values.descriptionFa ?? "",
    highlighted: values.current,
    sortOrder: values.sortOrder,
    published: values.published ?? true,
  };
}

export function toSkillPayload(values: Omit<SkillDto, "id"> & { id?: string }) {
  return {
    name: values.name,
    category: values.category,
    icon: values.icon?.trim() || "",
    sortOrder: values.sortOrder,
    published: values.published ?? true,
  };
}

export function toTestimonialPayload(values: Omit<TestimonialDto, "id"> & { id?: string; contentFa?: string }) {
  return {
    name: values.name,
    role: values.role,
    company: values.company,
    content: values.content,
    contentFa: values.contentFa ?? "",
    avatarUrl: values.avatarUrl ?? "",
    sortOrder: values.sortOrder,
    published: values.published ?? true,
  };
}

export const experienceFormSchema = Yup.object({
  slug: slugSchema,
  company: Yup.string().required("Company is required"),
  role: Yup.string().required("Role is required"),
  period: Yup.string().required("Period is required"),
  description: Yup.string().required("Description is required"),
  current: Yup.boolean().default(false),
  sortOrder: Yup.number().default(0),
  published: Yup.boolean().default(true),
});

export const skillFormSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  icon: Yup.string()
    .nullable()
    .transform((v) => (typeof v === "string" ? v.trim() : v))
    .test("valid-icon", "Enter a valid image URL or upload a file", (v) => {
      if (!v) return true;
      if (v.startsWith("/")) return true;
      if (v.startsWith("http://") || v.startsWith("https://")) {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    }),
  sortOrder: Yup.number().default(0),
  published: Yup.boolean().default(true),
});

export const testimonialFormSchema = Yup.object({
  slug: slugSchema,
  name: Yup.string().required("Name is required"),
  role: Yup.string().required("Role is required"),
  company: Yup.string().required("Company is required"),
  content: Yup.string().required("Content is required"),
  avatarUrl: Yup.string().nullable(),
  sortOrder: Yup.number().default(0),
  published: Yup.boolean().default(true),
});

export const articleFormSchema = Yup.object({
  slug: slugSchema,
  title: Yup.string().required("Title is required"),
  excerpt: Yup.string().required("Excerpt is required"),
  contentHtml: Yup.string().required("Content is required"),
  coverImageUrl: Yup.string().nullable(),
  publishedAt: Yup.string().required("Published date is required"),
  published: Yup.boolean().default(true),
});

const pageSubtitleSchema = Yup.object({
  subtitle: Yup.string().default(""),
  subtitleFa: Yup.string().default(""),
});

export const siteSettingsSchema = Yup.object({
  heroTitle: Yup.string().required("Hero title is required"),
  heroSubtitle: Yup.string().required("Hero subtitle is required"),
  heroBio: Yup.string().required("Hero bio is required"),
  heroPortraitUrl: Yup.string().nullable(),
  cvUrl: Yup.string().nullable(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().nullable(),
  location: Yup.string().nullable(),
  githubUrl: Yup.string().url("Invalid URL").nullable(),
  linkedinUrl: Yup.string().url("Invalid URL").nullable(),
  telegramUrl: Yup.string().url("Invalid URL").nullable(),
  instagramUrl: Yup.string().url("Invalid URL").nullable(),
  twitterUrl: Yup.string().url("Invalid URL").nullable(),
  pageSubtitles: Yup.object({
    services: pageSubtitleSchema.default(undefined),
    experience: pageSubtitleSchema.default(undefined),
    projects: pageSubtitleSchema.default(undefined),
    testimonials: pageSubtitleSchema.default(undefined),
  }).default(undefined),
});

export function toSiteSettingsPayload(values: SiteSettingsDto) {
  return {
    heroTitle: values.heroTitle,
    heroTitleFa: values.heroTitleFa ?? "",
    heroSubtitle: values.heroSubtitle,
    heroSubtitleFa: values.heroSubtitleFa ?? "",
    heroBio: values.heroBio,
    heroBioFa: values.heroBioFa ?? "",
    heroPortraitUrl: values.heroPortraitUrl ?? "",
    email: values.email,
    phone: values.phone ?? "",
    location: values.location ?? "",
    cvUrl: values.cvUrl ?? "",
    githubUrl: values.githubUrl ?? "",
    linkedinUrl: values.linkedinUrl ?? "",
    telegramUrl: values.telegramUrl ?? "",
    instagramUrl: values.instagramUrl ?? "",
    twitterUrl: values.twitterUrl ?? "",
    aboutContent: values.aboutContent ?? "",
    aboutContentFa: values.aboutContentFa ?? "",
    pageSubtitles: values.pageSubtitles ?? {},
  };
}

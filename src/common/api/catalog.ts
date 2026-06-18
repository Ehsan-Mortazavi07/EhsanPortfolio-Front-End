import { SERVER_BASE_API_URL } from "@/common/constants";
import { SEED_SETTINGS } from "@/common/data/seed";
import type {
  ArticleDetailDto,
  ArticleListItemDto,
  ContactFormDto,
  ExperienceDto,
  PagedResult,
  ProjectDto,
  ServiceDto,
  SiteSettingsDto,
  SkillDto,
  TestimonialDto,
} from "@/common/interfaces";
import { withSocialDefaults } from "@/common/utils/site-settings";

const REVALIDATE = 120;

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${SERVER_BASE_API_URL}${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function fetchCatalogList<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${SERVER_BASE_API_URL}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return (await res.json()) as T[];
  } catch {
    return [];
  }
}

async function fetchCatalogPaged<T>(path: string): Promise<PagedResult<T>> {
  const empty: PagedResult<T> = { items: [], total: 0, page: 1, pageSize: 20 };
  try {
    const res = await fetch(`${SERVER_BASE_API_URL}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return empty;
    return (await res.json()) as PagedResult<T>;
  } catch {
    return empty;
  }
}

export async function fetchSiteSettings(): Promise<SiteSettingsDto> {
  try {
    const res = await fetch(`${SERVER_BASE_API_URL}/catalog/settings`, {
      cache: "no-store",
    });
    if (!res.ok) return withSocialDefaults(SEED_SETTINGS);
    return withSocialDefaults((await res.json()) as SiteSettingsDto);
  } catch {
    return withSocialDefaults(SEED_SETTINGS);
  }
}

export async function fetchServices(): Promise<ServiceDto[]> {
  return fetchCatalogList<ServiceDto>("/catalog/services");
}

export async function fetchExperience(): Promise<ExperienceDto[]> {
  return fetchCatalogList<ExperienceDto>("/catalog/experience");
}

export async function fetchSkills(): Promise<SkillDto[]> {
  return fetchCatalogList<SkillDto>("/catalog/skills");
}

export async function fetchTestimonials(): Promise<TestimonialDto[]> {
  return fetchCatalogList<TestimonialDto>("/catalog/testimonials");
}

export async function fetchProjects(params?: {
  page?: number;
  pageSize?: number;
  featured?: boolean;
}): Promise<PagedResult<ProjectDto>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params?.featured) qs.set("featured", "true");
  const query = qs.toString();
  const path = `/catalog/projects${query ? `?${query}` : ""}`;
  return fetchCatalogPaged<ProjectDto>(path);
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectDto | null> {
  try {
    const res = await fetch(`${SERVER_BASE_API_URL}/catalog/projects/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ProjectDto;
  } catch {
    return null;
  }
}

export async function fetchArticles(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<ArticleListItemDto>> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.pageSize) qs.set("pageSize", String(params.pageSize));
  const query = qs.toString();
  const path = `/catalog/articles${query ? `?${query}` : ""}`;
  return fetchCatalogPaged<ArticleListItemDto>(path);
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleDetailDto | null> {
  try {
    const res = await fetch(`${SERVER_BASE_API_URL}/catalog/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return (await res.json()) as ArticleDetailDto;
  } catch {
    return null;
  }
}

export async function submitContactForm(body: ContactFormDto): Promise<{ ok: boolean }> {
  const res = await fetch(`${SERVER_BASE_API_URL}/catalog/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(data.message || "Failed to send message.");
  }
  return res.json();
}

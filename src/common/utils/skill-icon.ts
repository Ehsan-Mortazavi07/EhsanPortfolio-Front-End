const SIMPLE_ICON_SLUG: Record<string, string> = {
  nestjs: "nestjs",
  react: "react",
  nextjs: "nextdotjs",
  next: "nextdotjs",
  postgresql: "postgresql",
  postgres: "postgresql",
  mongodb: "mongodb",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  nodejs: "nodedotjs",
  node: "nodedotjs",
  docker: "docker",
  kubernetes: "kubernetes",
  redis: "redis",
  graphql: "graphql",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  aws: "amazonaws",
  azure: "microsoftazure",
  gcp: "googlecloud",
  python: "python",
  java: "java",
  go: "go",
  golang: "go",
  rust: "rust",
  vue: "vuedotjs",
  angular: "angular",
  svelte: "svelte",
  prisma: "prisma",
  mysql: "mysql",
  nginx: "nginx",
  linux: "linux",
  figma: "figma",
};

function isMongoId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function resolveSkillIconSlug(slug: string, name: string): string | null {
  const candidates = new Set<string>();

  if (slug && !isMongoId(slug)) {
    candidates.add(slug.trim().toLowerCase());
    candidates.add(normalizeKey(slug));
  }

  candidates.add(name.trim().toLowerCase());
  candidates.add(normalizeKey(name));

  for (const key of candidates) {
    if (key && SIMPLE_ICON_SLUG[key]) return SIMPLE_ICON_SLUG[key];
  }

  return null;
}

export function skillIconUrl(slug: string, name: string): string | null {
  const icon = resolveSkillIconSlug(slug, name);
  if (!icon) return null;
  return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${icon}.svg`;
}

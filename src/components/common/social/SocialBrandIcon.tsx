import Image from "next/image";

export type SocialBrand = "github" | "linkedin" | "telegram" | "instagram";

const BRAND_SLUG: Record<SocialBrand, string> = {
  github: "github",
  linkedin: "linkedin",
  telegram: "telegram",
  instagram: "instagram",
};

export function socialBrandIconUrl(brand: SocialBrand): string {
  return `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${BRAND_SLUG[brand]}.svg`;
}

type Props = {
  brand: SocialBrand;
  size?: number;
  className?: string;
};

export function SocialBrandIcon({ brand, size = 20, className = "" }: Props) {
  return (
    <Image
      src={socialBrandIconUrl(brand)}
      alt=""
      width={size}
      height={size}
      className={`social-brand-icon ${className}`.trim()}
      aria-hidden
      unoptimized
    />
  );
}

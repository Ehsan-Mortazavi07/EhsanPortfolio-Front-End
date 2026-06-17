import type { NextConfig } from "next";

const PRODUCTION_IMAGE_HOSTS = ["api.ehsanmor.ir", "ehsan-portfolio-api.onrender.com"] as const;

function imageRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const patterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    { protocol: "https", hostname: "cdn.jsdelivr.net", pathname: "/**" },
    ...PRODUCTION_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    })),
    { protocol: "http", hostname: "127.0.0.1", port: "7781", pathname: "/**" },
    { protocol: "http", hostname: "localhost", port: "7781", pathname: "/**" },
  ];

  const raw = process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.trim();
  if (!raw) return patterns;

  try {
    const u = new URL(raw);
    const fromEnv = {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      port: u.port || undefined,
      pathname: "/**",
    };
    const exists = patterns.some(
      (p) => p.hostname === fromEnv.hostname && (p.protocol === fromEnv.protocol || !p.protocol),
    );
    return exists ? patterns : [fromEnv, ...patterns];
  } catch {
    return patterns;
  }
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: imageRemotePatterns(),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ehsanmor.ir" }],
        destination: "https://ehsanmor.ir/:path*",
        permanent: true,
      },
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:slug", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

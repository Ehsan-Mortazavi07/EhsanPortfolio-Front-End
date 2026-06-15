import type { NextConfig } from "next";

function imageRemotePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const defaults: NonNullable<NextConfig["images"]>["remotePatterns"] = [
    { protocol: "https", hostname: "cdn.jsdelivr.net", pathname: "/**" },
    { protocol: "http", hostname: "127.0.0.1", port: "7781", pathname: "/**" },
    { protocol: "http", hostname: "localhost", port: "7781", pathname: "/**" },
  ];

  const raw = process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.trim();
  if (!raw) return defaults;

  try {
    const u = new URL(raw);
    return [
      {
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        port: u.port || undefined,
        pathname: "/**",
      },
    ];
  } catch {
    return defaults;
  }
}

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: imageRemotePatterns(),
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/", permanent: false },
      { source: "/blog/:slug", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

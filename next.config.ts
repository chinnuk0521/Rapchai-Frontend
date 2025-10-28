import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "rapchai.com" },
      { protocol: "https", hostname: "www.rapchai.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
    ],
    minimumCacheTTL: 31536000,
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.com/api',
  },
  // In production, NEXT_PUBLIC_API_URL should point to deployed backend
  // Rewrites are disabled for production deployments
  async rewrites() {
    return [];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
      { protocol: "https", hostname: "rapchai.com" },
      { protocol: "https", hostname: "www.rapchai.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
      { protocol: "https", hostname: "ukdrlbhorhsaupkskfvy.supabase.co" },
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

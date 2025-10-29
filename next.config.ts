import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  // Rewrites only work in development (for local backend)
  // In production, NEXT_PUBLIC_API_URL should point to deployed backend
  async rewrites() {
    // Only use rewrites in development when backend is local
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_API_URL?.includes('http')) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*',
        },
      ];
    }
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

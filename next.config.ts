import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Restrict remote image sources to known safe hostnames only.
    // "**" (open wildcard) is removed — it allows SSRF-style image proxy abuse.
    // Add specific hostnames below if you host service images on a CDN.
    remotePatterns: [
      {
        // Cloudinary (common free image CDN)
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Imgur (common public image host)
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        // Google user content (profile photos etc.)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // Strict mode catches potential issues during development
  reactStrictMode: true,
  // Prevent Next.js from exposing the X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;

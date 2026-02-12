import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const routes = [
    "",
    "/about",
    "/advisor-resources",
    "/careers",
    "/contact",
    "/cookies",
    "/disclaimer",
    "/email-updates",
    "/for-advisors",
    "/help",
    "/how-it-works",
    "/press",
    "/privacy",
    "/quiz",
    "/request-intro",
    "/resources",
    "/search",
    "/terms",
    "/category/retirement-planning",
    "/category/wealth-management",
    "/category/insurance-risk",
    "/category/property-investment",
    "/category/tax-planning",
    "/category/estate-planning",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}

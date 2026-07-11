import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { seedCanteens } from "@/lib/seed";

/**
 * Public routes. Canteen slugs come from the seed set; when running on
 * Supabase, extend this to read live slugs from the database.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const canteenRoutes = seedCanteens.map((c) => ({
    url: `${site.url}/canteen/${c.slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...canteenRoutes,
  ];
}

import { MetadataRoute } from "next";
import { getLivePosts } from "@/lib/supabase-posts";

export const revalidate = 86400; // Daily revalidation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://draftline.dev";
  const now = new Date();

  // Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/topics`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/topics/travel-places`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/topics/fashion-culture`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/topics/lifestyle-modern-living`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/topics/business-money-entrepreneurship`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const posts = await getLivePosts();

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.publishedAt || now),
      changeFrequency: "weekly",
      priority: post.featured ? 0.95 : 0.85,
    }));

    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}

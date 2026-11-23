import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://draftline.dev";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/articles", "/topics", "/posts/"],
      disallow: [
        "/profile",
        "/write",
        "/login",
        "/signup",
        "/api/",
        "/auth/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

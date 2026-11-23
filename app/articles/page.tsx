import type { Metadata } from "next";
import { getLivePosts } from "@/lib/supabase-posts";
import { ArticlesPageClient } from "@/components/articles-page-client";

export const revalidate = 86400; // 24-hour cache with on-demand purge via /api/cron/refresh-stories

export const metadata: Metadata = {
  title: "All Articles — Complete Editorial Archive",
  description:
    "Explore the complete Draftline archive of stories across travel places, fashion and culture, modern living, and mindful entrepreneurship.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    type: "website",
    title: "All Articles — Complete Editorial Archive | Draftline",
    description:
      "Explore the complete Draftline archive of stories across travel places, fashion and culture, modern living, and mindful entrepreneurship.",
    url: "/articles",
    siteName: "Draftline",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Articles — Complete Editorial Archive | Draftline",
    description:
      "Explore the complete Draftline archive of stories across travel places, fashion and culture, modern living, and mindful entrepreneurship.",
  },
};

export default async function ArticlesPage() {
  const allPosts = await getLivePosts();

  return <ArticlesPageClient allPosts={allPosts} />;
}

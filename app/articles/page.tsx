import type { Metadata } from "next";
import { getLivePosts } from "@/lib/supabase-posts";
import { ArticlesPageClient } from "@/components/articles-page-client";

export const dynamic = "force-dynamic";

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

interface ArticlesPageProps {
  searchParams?: Promise<{ category?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const allPosts = await getLivePosts();
  const resolvedParams = searchParams ? await searchParams : undefined;
  const initialCategory = resolvedParams?.category || "All";

  return (
    <ArticlesPageClient
      allPosts={allPosts}
      initialCategory={initialCategory as any}
    />
  );
}

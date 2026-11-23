import type { Metadata } from "next";
import { getLivePosts } from "@/lib/supabase-posts";
import { HomePageClient } from "@/components/home-page-client";

// Daily revalidation: 86400 seconds (24 hours) with on-demand purge via /api/cron/refresh-stories
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Draftline — Contemporary Editorial Journal",
  description:
    "An editorial publication for travel places, fashion and culture, modern living, and mindful entrepreneurship.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Draftline — Contemporary Editorial Journal",
    description:
      "An editorial publication for travel places, fashion and culture, modern living, and mindful entrepreneurship.",
    url: "/",
    siteName: "Draftline",
    images: [
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Draftline Editorial Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Draftline — Contemporary Editorial Journal",
    description:
      "An editorial publication for travel places, fashion and culture, modern living, and mindful entrepreneurship.",
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    ],
  },
};

export default async function HomePage() {
  const allPosts = await getLivePosts();

  return <HomePageClient allPosts={allPosts} />;
}

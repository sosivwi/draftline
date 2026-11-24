import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Gem, Coffee, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { getLivePosts } from "@/lib/supabase-posts";
import {
  CATEGORIES,
  Category,
  slugifyCategory,
  isCategoryMatch,
} from "@/lib/mock-posts";
import { ArticleCard } from "@/components/article-card";
import { TextReveal } from "@/components/TextReveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Topics & Editorial Pillars",
  description:
    "Browse stories by topic across Travel Places, Fashion & Culture, Lifestyle & Modern Living, and Business & Entrepreneurship.",
  alternates: {
    canonical: "/topics",
  },
  openGraph: {
    type: "website",
    title: "Topics & Editorial Pillars | Draftline",
    description:
      "Browse stories by topic across Travel Places, Fashion & Culture, Lifestyle & Modern Living, and Business & Entrepreneurship.",
    url: "/topics",
    siteName: "Draftline",
  },
  twitter: {
    card: "summary_large_image",
    title: "Topics & Editorial Pillars | Draftline",
    description:
      "Browse stories by topic across Travel Places, Fashion & Culture, Lifestyle & Modern Living, and Business & Entrepreneurship.",
  },
};

const TOPIC_DETAILS: Record<
  Category,
  {
    icon: typeof Compass;
    description: string;
    subline: string;
  }
> = {
  "Travel Places": {
    icon: Compass,
    description:
      "Quiet luxury, remote sanctuaries, architectural ryokans, and slow voyages far removed from mass tourism.",
    subline: "Journeys & Destinations",
  },
  "Fashion & Culture": {
    icon: Gem,
    description:
      "Heirloom textiles, bespoke tailoring, mechanical horology, and cultural movements shaping enduring aesthetics.",
    subline: "Style & Material Culture",
  },
  "Lifestyle & Modern Living": {
    icon: Coffee,
    description:
      "Architectural stillness, meditative morning rituals, tactile interior design, and digital mindfulness.",
    subline: "Living & Well-being",
  },
  "Business, Money & Entrepreneurship": {
    icon: TrendingUp,
    description:
      "Calm companies, modern wealth architecture, bootstrapped cash flows, and high-leverage solopreneur models.",
    subline: "Ventures & Independence",
  },
};

export default async function TopicsPage() {
  const allPosts = await getLivePosts();

  // Group stories by category with normalized matching
  const storiesByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = allPosts.filter((p) => isCategoryMatch(p.category, cat));
    return acc;
  }, {} as Record<Category, typeof allPosts>);

  return (
    <div className="w-full text-content-primary">
      <div className="w-full pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800 mb-12">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Editorial Taxonomy</span>
            </div>
            <TextReveal as="h1" delay={0} masked={false} className="overflow-visible pb-1.5">
              <span className="block text-5xl md:text-6xl font-extrabold tracking-[-0.025em] leading-[1.15] sm:leading-[1.1] text-neutral-950 dark:text-white overflow-visible">
                Topics
              </span>
            </TextReveal>
          </div>
          <TextReveal delay={100}>
            <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
              Our publication is structured around four foundational pillars of
              modern life, curiosity, and aesthetic craft.
            </p>
          </TextReveal>
        </div>

        {/* 4 Pillars Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {CATEGORIES.map((cat, idx) => {
            const detail = TOPIC_DETAILS[cat];
            const Icon = detail.icon;
            const count = storiesByCategory[cat]?.length || 0;

            return (
              <TextReveal key={cat} delay={idx * 60}>
                <div className="p-6 sm:p-8 rounded-none border border-neutral-200 dark:border-neutral-800 bg-surface-card hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-950 dark:text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs px-2.5 py-1 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {count} {count === 1 ? "story" : "stories"}
                      </span>
                    </div>

                    <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1">
                      {detail.subline}
                    </div>
                    <h2 className="font-sans font-bold text-xl sm:text-2xl text-neutral-950 dark:text-white mb-3">
                      {cat}
                    </h2>
                    <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                      {detail.description}
                    </p>
                  </div>

                  <Link
                    href={`/topics/${slugifyCategory(cat)}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-950 dark:text-white hover:underline transition-all group pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60"
                  >
                    <span>Explore all {cat} dispatches</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </TextReveal>
            );
          })}
        </div>

        {/* Highlighted Stories by Category */}
        <div className="space-y-16">
          {CATEGORIES.map((cat) => {
            const stories = storiesByCategory[cat]?.slice(0, 2) || [];
            if (stories.length === 0) return null;

            return (
              <section key={cat} className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-sans font-bold text-xl sm:text-2xl text-neutral-950 dark:text-white">
                    Featured in {cat}
                  </h3>
                  <Link
                    href={`/topics/${slugifyCategory(cat)}`}
                    className="font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    See all ({storiesByCategory[cat]?.length}) →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                  {stories.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}

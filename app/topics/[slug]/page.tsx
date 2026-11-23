import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Compass,
  Gem,
  Coffee,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  PenSquare,
} from "lucide-react";
import { getLivePostsByCategory } from "@/lib/supabase-posts";
import {
  CATEGORIES,
  Category,
  slugifyCategory,
  isCategoryMatch,
} from "@/lib/mock-posts";
import { ArticleCard } from "@/components/article-card";
import { TextReveal } from "@/components/TextReveal";

export const dynamic = "force-dynamic";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

const TOPIC_CONFIG: Record<
  string,
  {
    name: Category;
    icon: typeof Compass;
    description: string;
    subline: string;
  }
> = {
  "travel-places": {
    name: "Travel Places",
    icon: Compass,
    description:
      "Quiet luxury, remote sanctuaries, architectural ryokans, and slow voyages far removed from mass tourism.",
    subline: "Journeys & Destinations",
  },
  "fashion-culture": {
    name: "Fashion & Culture",
    icon: Gem,
    description:
      "Heirloom textiles, bespoke tailoring, mechanical horology, and cultural movements shaping enduring aesthetics.",
    subline: "Style & Material Culture",
  },
  "lifestyle-modern-living": {
    name: "Lifestyle & Modern Living",
    icon: Coffee,
    description:
      "Architectural stillness, meditative morning rituals, tactile interior design, and digital mindfulness.",
    subline: "Living & Well-being",
  },
  "business-money-entrepreneurship": {
    name: "Business, Money & Entrepreneurship",
    icon: TrendingUp,
    description:
      "Calm companies, modern wealth architecture, bootstrapped cash flows, and high-leverage solopreneur models.",
    subline: "Ventures & Independence",
  },
};

function resolveTopic(slug: string) {
  // Direct key lookup
  if (TOPIC_CONFIG[slug]) {
    return { key: slug, ...TOPIC_CONFIG[slug] };
  }

  // Check matching category by slug or aliases
  const matchedCategory = CATEGORIES.find((cat) => isCategoryMatch(cat, slug));
  if (matchedCategory) {
    const key = slugifyCategory(matchedCategory);
    const config = TOPIC_CONFIG[key];
    return {
      key,
      name: matchedCategory,
      icon: config?.icon || Compass,
      description:
        config?.description ||
        `Curated stories, essays, and editorial dispatches in ${matchedCategory}.`,
      subline: config?.subline || "Editorial Pillar",
    };
  }

  return null;
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = resolveTopic(slug);

  if (!topic) {
    return {
      title: "Topic Not Found",
      description: "The requested topic could not be located in our editorial taxonomy.",
    };
  }

  return {
    title: `${topic.name} — Editorial Stories & Dispatches`,
    description: topic.description,
    alternates: {
      canonical: `/topics/${slug}`,
    },
    openGraph: {
      type: "website",
      title: `${topic.name} — Editorial Stories & Dispatches | Draftline`,
      description: topic.description,
      url: `/topics/${slug}`,
      siteName: "Draftline",
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.name} — Editorial Stories & Dispatches | Draftline`,
      description: topic.description,
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = resolveTopic(slug);

  if (!topic) {
    notFound();
  }

  const posts = await getLivePostsByCategory(slug);
  const Icon = topic.icon;

  return (
    <div className="w-full text-content-primary">
      <div className="w-full pb-20">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/topics"
            className="inline-flex items-center gap-2 text-xs font-mono text-content-secondary hover:text-content-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to All Topics</span>
          </Link>
        </div>

        {/* Topic Pillar Hero Header */}
        <div className="p-8 sm:p-12 mb-12 rounded-none border border-neutral-200 dark:border-neutral-800 bg-surface-card">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-950 dark:text-white shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold">
                  {topic.subline}
                </span>
              </div>

              <TextReveal as="h1" delay={0}>
                <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.025em] leading-[1.15] text-neutral-950 dark:text-white block mb-4">
                  {topic.name}
                </span>
              </TextReveal>

              <TextReveal delay={100}>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {topic.description}
                </p>
              </TextReveal>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
                {posts.length} {posts.length === 1 ? "story published" : "stories published"}
              </span>

              <Link
                href={`/articles?category=${encodeURIComponent(topic.name)}`}
                className="font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white underline transition-colors"
              >
                Filter archive by {topic.name} →
              </Link>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {posts.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-none">
            <p className="font-sans text-base text-neutral-600 dark:text-neutral-400 mb-4">
              No stories published in this pillar yet.
            </p>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
            >
              <PenSquare className="w-3.5 h-3.5" />
              <span>Write the first {topic.name} story</span>
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="font-sans font-bold text-xl text-neutral-950 dark:text-white">
                All {topic.name} Stories
              </h2>
              <span className="font-mono text-xs text-neutral-500">
                Chronological order
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse other topics</span>
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-950 dark:text-white hover:underline transition-colors group"
          >
            <span>View complete archive</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

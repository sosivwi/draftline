"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { Post } from "@/lib/mock-posts";
import { ArticleCard } from "./article-card";
import { DailyFeaturedHero } from "./DailyFeaturedHero";
import { TextReveal } from "./TextReveal";

interface HomePageClientProps {
  allPosts: Post[];
}

export function HomePageClient({ allPosts }: HomePageClientProps) {
  // Newest story at the very top of the stack is the Hero Featured Story
  const featuredPost = useMemo(() => {
    return allPosts[0] || null;
  }, [allPosts]);

  // Curated secondary stories immediately following the featured story
  const secondaryPosts = useMemo(() => {
    return allPosts.slice(1, 7);
  }, [allPosts]);

  return (
    <div className="w-full text-content-primary">
      <div className="w-full pb-16">
        {/* =========================================================================
            DAILY AUTO-ROTATING EDITORIAL FEATURED HERO (Reference: two.jpg)
            ========================================================================= */}
        {featuredPost && <DailyFeaturedHero post={featuredPost} />}

        {/* =========================================================================
            CURATED SECONDARY SECTION: "Latest Stories" / "Editor's Picks"
            ========================================================================= */}
        <section className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Selection</span>
              </div>
              <TextReveal as="h2">
                <span className="font-sans font-extrabold text-2xl sm:text-4xl tracking-tight text-neutral-950 dark:text-white">
                  Latest Stories
                </span>
              </TextReveal>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <Link
                href="/topics"
                className="text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                Browse Topics
              </Link>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 font-semibold text-neutral-950 dark:text-white hover:underline transition-colors group"
              >
                <span>View Full Archive</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* 2-Column Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
            {secondaryPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>

          {/* Bottom Callout to Archive */}
          <div className="mt-16 p-8 rounded-none border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-sans font-bold text-lg text-neutral-950 dark:text-white mb-1">
                Explore the Complete Archive
              </h3>
              <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Browse our complete collection of {allPosts.length} essays across Travel, Fashion, Living, and Business.
              </p>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-none text-xs sm:text-sm font-semibold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 transition-opacity shrink-0"
            >
              <span>Explore All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

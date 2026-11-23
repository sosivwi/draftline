"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Post, Category, isCategoryMatch } from "@/lib/mock-posts";
import { ArticleCard } from "./article-card";
import { PostCardSkeleton } from "./post-card-skeleton";
import { TextReveal } from "./TextReveal";
import { ChevronDown, Loader2, Sparkles } from "lucide-react";

export type FilterCategory = "All" | Category;

const CATEGORIES_TABS: FilterCategory[] = [
  "All",
  "Travel Places",
  "Fashion & Culture",
  "Lifestyle & Modern Living",
  "Business, Money & Entrepreneurship",
];

interface ArticlesPageClientProps {
  allPosts: Post[];
  initialCategory?: FilterCategory;
}

export function ArticlesPageClient({
  allPosts,
  initialCategory = "All",
}: ArticlesPageClientProps) {
  // Resolve initial category with normalized matching
  const resolvedInitial = useMemo<FilterCategory>(() => {
    if (!initialCategory || initialCategory === "All") return "All";
    const found = CATEGORIES_TABS.find((cat) => isCategoryMatch(cat, initialCategory));
    return found || "All";
  }, [initialCategory]);

  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>(resolvedInitial);
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Sync state if initialCategory changes
  useEffect(() => {
    setSelectedCategory(resolvedInitial);
  }, [resolvedInitial]);

  // Reset pagination to 6 when switching categories
  const handleSelectCategory = (cat: FilterCategory) => {
    setSelectedCategory(cat);
    setVisibleCount(6);
    setIsLoadingMore(false);
  };

  // Filter posts based on active category using normalized matching
  const filteredGridPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allPosts;
    }
    return allPosts.filter((p) => isCategoryMatch(p.category, selectedCategory));
  }, [allPosts, selectedCategory]);

  // Sliced posts for pagination
  const displayedPosts = useMemo(() => {
    return filteredGridPosts.slice(0, visibleCount);
  }, [filteredGridPosts, visibleCount]);

  const hasMore = visibleCount < filteredGridPosts.length;
  const remainingCount = filteredGridPosts.length - visibleCount;
  const skeletonCount = Math.min(4, Math.max(0, remainingCount));

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 2000);
  };

  return (
    <div className="w-full text-content-primary">
      <div className="w-full pb-20">
        {/* =========================================================================
            SPLIT EDITORIAL HEADER
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Journal Archive</span>
            </div>
            <TextReveal as="h1" delay={0}>
              <span className="text-5xl md:text-6xl font-extrabold tracking-[-0.025em] leading-[1.15] text-neutral-950 dark:text-white">
                Articles
              </span>
            </TextReveal>
          </div>
          <TextReveal delay={100}>
            <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
              Every story we publish is a reflection of modern culture, travel,
              style, and ambition—crafted to inform and inspire.
            </p>
          </TextReveal>
        </div>

        {/* =========================================================================
            MINIMAL TEXT-ONLY CATEGORY FILTER BAR
            ========================================================================= */}
        <div className="flex items-center gap-6 overflow-x-auto pt-6 pb-8 scrollbar-none mb-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
          {CATEGORIES_TABS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelectCategory(cat)}
                className={`text-sm font-medium whitespace-nowrap pb-1 transition-colors relative ${
                  isActive
                    ? "text-neutral-950 dark:text-white font-semibold"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-950 dark:bg-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            2-COLUMN BORDERLESS EDITORIAL POST GRID
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          {displayedPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}

          {/* Skeletons during 2-second pagination delay */}
          {isLoadingMore &&
            Array.from({ length: skeletonCount }).map((_, idx) => (
              <PostCardSkeleton key={`skeleton-${idx}`} />
            ))}
        </div>

        {/* =========================================================================
            LOAD MORE PAGINATION BUTTON
            ========================================================================= */}
        {hasMore && (
          <div className="mt-16 flex flex-col items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-none text-xs sm:text-sm font-semibold tracking-wider uppercase border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white hover:border-neutral-900 dark:hover:border-white transition-all duration-200 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading Dispatches...</span>
                </>
              ) : (
                <>
                  <span>Load More Articles</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              Showing {displayedPosts.length} of {filteredGridPosts.length} stories
            </span>
          </div>
        )}

        {/* Empty state */}
        {filteredGridPosts.length === 0 && (
          <div className="py-20 text-center max-w-md mx-auto">
            <p className="font-sans font-bold text-lg text-neutral-950 dark:text-white mb-2">
              No stories published in this topic yet
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Check back soon as our editorial guild files new dispatches daily.
            </p>
            <button
              type="button"
              onClick={() => handleSelectCategory("All")}
              className="px-6 py-2.5 rounded-none text-xs font-semibold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90"
            >
              Reset to All Topics
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { Post, Category } from "@/lib/mock-posts";
import { ArticleCard } from "./article-card";
import { PostCardSkeleton } from "./post-card-skeleton";
import { RevealText } from "./RevealText";
import { ChevronDown, Loader2 } from "lucide-react";

export type FilterCategory = "All" | Category;

const CATEGORIES_TABS: FilterCategory[] = [
  "All",
  "Travel Places",
  "Fashion & Culture",
  "Lifestyle & Modern Living",
  "Business, Money & Entrepreneurship",
];

interface HomePageClientProps {
  allPosts: Post[];
  initialFeaturedPost?: Post;
}

export function HomePageClient({ allPosts }: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Reset pagination to 6 when switching categories
  const handleSelectCategory = (cat: FilterCategory) => {
    setSelectedCategory(cat);
    setVisibleCount(6);
    setIsLoadingMore(false);
  };

  // Filter posts based on active category
  const filteredGridPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return allPosts;
    }
    return allPosts.filter((p) => p.category === selectedCategory);
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-border-subtle/50">
          <div>
            <RevealText delay={0}>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-0.025em] leading-[1.15] text-neutral-950 dark:text-white">
                Articles
              </h1>
            </RevealText>
          </div>
          <RevealText delay={100}>
            <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Every story we publish is a reflection of modern culture, travel,
              style, and ambition—crafted to inform and inspire.
            </p>
          </RevealText>
        </div>

        {/* =========================================================================
            MINIMAL TEXT-ONLY CATEGORY FILTER BAR
            ========================================================================= */}
        <RevealText delay={180}>
          <div className="flex items-center gap-6 overflow-x-auto pt-6 pb-8 scrollbar-none mb-4">
            {CATEGORIES_TABS.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`text-sm font-medium whitespace-nowrap pb-1 transition-colors ${
                    isActive
                      ? "text-neutral-950 dark:text-white font-semibold border-b-2 border-neutral-950 dark:border-white"
                      : "text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 border-b-2 border-transparent"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </RevealText>

        {/* =========================================================================
            BORDERLESS 2-COLUMN EDITORIAL GRID
            ========================================================================= */}
        {displayedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-12">
              {displayedPosts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
              {isLoadingMore &&
                Array.from({ length: skeletonCount }).map((_, idx) => (
                  <PostCardSkeleton key={`skeleton-${idx}`} />
                ))}
            </div>

            {/* Load more button */}
            {hasMore && (
              <div className="mt-14 text-center flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium border border-border-strong/70 bg-surface-card hover:bg-surface-muted text-content-primary transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-content-primary" />
                      <span>Loading stories...</span>
                    </>
                  ) : (
                    <>
                      <span>Load more stories</span>
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                    </>
                  )}
                </button>
                <p className="font-mono text-[11px] text-content-muted mt-2.5">
                  Viewing {displayedPosts.length} of {filteredGridPosts.length}{" "}
                  articles
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto">
            <p className="font-sans font-semibold text-base text-content-primary mb-1">
              No articles found
            </p>
            <p className="font-sans text-xs sm:text-sm text-content-secondary mb-5">
              We are currently drafting new stories in {selectedCategory}.
            </p>
            <button
              type="button"
              onClick={() => handleSelectCategory("All")}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Reset to All Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

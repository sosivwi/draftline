"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, Clock, Bookmark } from "lucide-react";
import { Post } from "@/lib/mock-posts";
import { EditorialImage } from "@/components/editorial-image";
import { TextReveal } from "@/components/TextReveal";

interface DailyFeaturedHeroProps {
  post: Post;
}

export function DailyFeaturedHero({ post }: DailyFeaturedHeroProps) {
  // Format today's date for editorial dispatch label
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="w-full mb-16 sm:mb-20">
      {/* 1. Top Date Pill Badge */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-none border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
          <span>Daily Dispatch • {todayLabel}</span>
        </span>
        <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 hidden sm:inline">
          Issue {new Date().getFullYear()}.{new Date().getMonth() + 1}
        </span>
      </div>

      {/* 2. Large High-Contrast Editorial Headline */}
      <TextReveal as="h1" delay={40} masked={false} className="mb-6 overflow-visible">
        <Link
          href={`/posts/${post.slug}`}
          className="block font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-[-0.03em] leading-[1.15] sm:leading-[1.1] pb-1.5 overflow-visible text-neutral-950 dark:text-white hover:opacity-85 transition-opacity"
        >
          {post.title}
        </Link>
      </TextReveal>

      {/* 3. Wide 0px-Radius Editorial Hero Image */}
      <Link href={`/posts/${post.slug}`} className="block group mb-5">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.35/1] min-h-[300px] sm:min-h-[460px] lg:min-h-[520px] rounded-none overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          <EditorialImage
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1440px) 90vw, 1440px"
            className="group-hover:scale-[1.025] transition-transform duration-700 ease-out"
          />
        </div>
      </Link>

      {/* 4. Metadata Row Directly Beneath Image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-neutral-200 dark:border-neutral-800 mb-6 font-mono text-xs">
        {/* Left side: Written by [Author pill] */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-[11px]">
            Written by
          </span>
          <span className="px-2.5 py-1 rounded-none bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-white font-sans font-semibold border border-neutral-200 dark:border-neutral-800 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neutral-950 dark:bg-white shrink-0" />
            <span>{post.author.name}</span>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="text-neutral-500 dark:text-neutral-400 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </span>
          <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
          <span className="text-neutral-500 dark:text-neutral-400 hidden sm:inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.publishedAt}</span>
          </span>
        </div>

        {/* Right side: Topic Category Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-none bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-mono text-[11px] uppercase tracking-wider font-semibold">
            {post.category}
          </span>
          <span className="px-2.5 py-1 rounded-none border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono text-[11px] uppercase tracking-wider">
            Featured Selection
          </span>
        </div>
      </div>

      {/* 5. Clean 2-3 Line Editorial Deck / Excerpt */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <TextReveal delay={80} className="flex-1 max-w-4xl">
          <p className="font-sans text-lg sm:text-2xl text-neutral-700 dark:text-neutral-200 leading-relaxed font-normal">
            {post.excerpt}
          </p>
        </TextReveal>

        <Link
          href={`/posts/${post.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-none text-xs sm:text-sm font-semibold tracking-wide bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 transition-all active:scale-95 shrink-0 self-start md:self-end"
        >
          <span>Read Full Dispatch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

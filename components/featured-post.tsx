"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Post } from "@/lib/mock-posts";

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="group relative rounded-3xl border border-border-subtle bg-surface-card p-4 sm:p-6 lg:p-8 transition-all duration-300 hover:border-border-strong hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
        {/* Left (~60% = 7 cols on lg): Large rounded cover image with subtle hover zoom */}
        <div className="lg:col-span-7 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] min-h-[260px] sm:min-h-[340px] lg:min-h-[380px] rounded-2xl overflow-hidden bg-surface-muted">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Right (~40% = 5 cols on lg): Editorial content */}
        <div className="lg:col-span-5 flex flex-col justify-between py-1 lg:py-2">
          <div>
            {/* Category badge & metadata */}
            <div className="flex items-center flex-wrap gap-2.5 mb-3.5">
              <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-border-subtle bg-surface-muted/80 text-content-primary font-medium">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs text-content-muted">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.publishedAt}</span>
              </div>
              <span className="text-content-muted" aria-hidden="true">
                •
              </span>
              <div className="flex items-center gap-1 font-mono text-xs text-content-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Bold Headline */}
            <h2 className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-content-primary leading-[1.15] mb-4 group-hover:text-content-primary transition-colors">
              <Link
                href={`/posts/${post.slug}`}
                className="focus:outline-none focus-visible:underline"
              >
                {post.title}
              </Link>
            </h2>

            {/* 3-4 Line Excerpt */}
            <p className="font-sans text-sm sm:text-base text-content-secondary leading-relaxed line-clamp-3 sm:line-clamp-4 mb-6">
              {post.excerpt}
            </p>
          </div>

          {/* Bottom Area: Author + Read More Pill Button */}
          <div className="pt-4 border-t border-border-subtle/80 flex items-center justify-between gap-4 mt-auto">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border-subtle shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-content-primary">
                  {post.author.name}
                </span>
                <span className="font-mono text-[11px] text-content-muted">
                  {post.author.role}
                </span>
              </div>
            </div>

            {/* Solid Read More Pill Button (styled with Tailwind bg-accent text-accent-foreground) */}
            <Link
              href={`/posts/${post.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 active:scale-95 shadow-sm group-hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent bg-accent text-accent-foreground hover:opacity-90"
            >
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import { Post } from "@/lib/mock-posts";
import { RevealText } from "@/components/RevealText";
import { EditorialImage } from "@/components/editorial-image";

interface ArticleCardProps {
  post: Post;
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-none select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
    >
      <article className="rounded-none bg-transparent">
        {/* Cover image container: completely sharp 90-degree corners (rounded-none), aspect 16/10, smooth hover zoom & loading state */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-none bg-neutral-100 dark:bg-neutral-900">
          <EditorialImage
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        </div>

        {/* Editorial Typography Below Image */}
        <RevealText threshold={0.05} className="w-full">
          <h3 className="mt-3.5 text-lg font-bold tracking-[-0.015em] leading-[1.25] text-neutral-950 dark:text-white group-hover:opacity-75 transition-opacity line-clamp-2">
            {post.title}
          </h3>

          {/* 2-line Excerpt */}
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Metadata Row */}
          <div className="mt-3 flex items-center gap-2.5 flex-wrap">
            <span className="rounded-none text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400 select-none">
              {post.category}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {post.author.name} · {post.readTime}
            </span>
          </div>
        </RevealText>
      </article>
    </Link>
  );
}

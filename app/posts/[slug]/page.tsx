import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getLivePostBySlug, getLivePosts } from "@/lib/supabase-posts";
import { ArticleCard } from "@/components/article-card";
import { RevealText } from "@/components/RevealText";
import { EditorialImage } from "@/components/editorial-image";
import { ArticleActionButtons } from "@/components/article-action-buttons";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400; // Daily revalidation, purged on-demand by /api/cron/refresh-stories

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getLivePostBySlug(slug);
  if (!post) {
    return {
      title: "Story Not Found",
      description: "The requested article could not be located in our editorial archives.",
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://draftline.dev";
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    keywords: [
      post.category,
      "editorial journal",
      "Draftline dispatch",
      "culture",
      "modern living",
      "journalism",
    ],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description: post.excerpt,
      siteName: "Draftline",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      section: post.category,
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      creator: post.author.role?.startsWith("@") ? post.author.role : "@draftline",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getLivePostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://draftline.dev";
  const postUrl = `${siteUrl}/posts/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl,
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": [post.coverImage],
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Draftline",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/favicon.ico`,
      },
    },
    "articleSection": post.category,
  };

  // Get other posts for "Related Stories"
  const allPosts = await getLivePosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <article className="w-full bg-surface-upper text-content-primary">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Article Header Container */}
      <div className="w-[90%] mx-auto pt-8 pb-8">
        {/* Navigation Breadcrumb */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-content-secondary hover:text-content-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to all articles</span>
        </Link>

        {/* Category & Metadata */}
        <RevealText delay={0}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
            <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-none border border-border-subtle bg-surface-muted text-content-primary font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-2 font-mono text-xs text-content-muted">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.publishedAt}</span>
              </div>
              <span className="text-content-muted select-none" aria-hidden="true">
                •
              </span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </RevealText>

        {/* Title */}
        <RevealText delay={80}>
          <h1 className="w-full font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-content-primary leading-[1.1] md:leading-[1.06] tracking-[-0.025em]">
            {post.title}
          </h1>
        </RevealText>

        {/* Excerpt Lead */}
        <RevealText delay={160}>
          <p className="w-full max-w-5xl mt-5 font-sans text-lg sm:text-xl text-content-secondary leading-relaxed">
            {post.excerpt}
          </p>
        </RevealText>

        {/* Author & Action Row */}
        <RevealText delay={240}>
          <div className="w-full mt-8 pt-6 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-border-subtle">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border-subtle bg-surface-muted shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-sans font-semibold text-sm text-content-primary">
                  {post.author.name}
                </p>
                <p className="font-mono text-xs text-content-muted">
                  {post.author.role}
                </p>
              </div>
            </div>

            <ArticleActionButtons
              post={{
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt,
              }}
            />
          </div>
        </RevealText>
      </div>

      {/* Hero Image */}
      <div className="w-[90%] mx-auto mb-12 sm:mb-16">
        <div className="relative w-full h-[380px] sm:h-[500px] lg:h-[620px] rounded-none overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          <EditorialImage
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="90vw"
            priority
            className="w-full h-full object-cover rounded-none"
          />
        </div>
        <RevealText>
          <p className="font-mono text-[11px] text-content-muted text-center mt-3">
            Photography sourced via Editorial Archives • High-resolution archival
          </p>
        </RevealText>
      </div>

      {/* Article Body */}
      <div className="w-[90%] mx-auto pb-16 sm:pb-24">
        <div className="w-full max-w-none space-y-6 text-lg md:text-[19px] leading-[1.85] tracking-[0.005em] text-content-secondary">
          {post.content.map((paragraph, idx) => {
            if (paragraph.startsWith("## ")) {
              return (
                <RevealText key={idx} threshold={0.05}>
                  <h2 className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-content-primary pt-8 pb-1">
                    {paragraph.replace(/^##\s+/, "")}
                  </h2>
                </RevealText>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <RevealText key={idx} threshold={0.05}>
                  <h3 className="font-sans font-semibold text-xl sm:text-2xl tracking-tight text-content-primary pt-6 pb-1">
                    {paragraph.replace(/^###\s+/, "")}
                  </h3>
                </RevealText>
              );
            }
            return (
              <RevealText key={idx} threshold={0.05}>
                <p
                  className={
                    idx === 0
                      ? "first-letter:font-bold first-letter:text-5xl first-letter:leading-none first-letter:mr-2.5 first-letter:float-left first-letter:text-content-primary text-content-primary"
                      : ""
                  }
                >
                  {paragraph}
                </p>
              </RevealText>
            );
          })}

          {/* Editorial Callout */}
          <RevealText threshold={0.05}>
            <div className="my-10 p-6 sm:p-8 rounded-none border-l-4 border-accent bg-surface-muted/60">
              <blockquote className="font-sans font-medium italic text-lg sm:text-xl text-content-primary mb-3">
                &ldquo;Great typography is not merely the arrangement of characters;
                it is the invisible architecture that governs human attention and
                thought.&rdquo;
              </blockquote>
              <p className="font-mono text-xs text-content-muted">
                — Draftline Editorial Guild Note
              </p>
            </div>
          </RevealText>
        </div>
      </div>

      {/* Related Stories Band (Surface Lower) */}
      <section className="border-t border-border-subtle bg-surface-lower py-16">
        <div className="w-[90%] mx-auto">
          {/* Header Bar with balanced padding and baseline alignment */}
          <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 mb-8 rounded-none border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60">
            <h3 className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-neutral-950 dark:text-white">
              More from Draftline
            </h3>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors group shrink-0"
            >
              <span>View all articles</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

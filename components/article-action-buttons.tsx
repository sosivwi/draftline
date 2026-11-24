"use client";

import React, { useState, useEffect } from "react";
import { Share2, Bookmark, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { isPostSaved, toggleSavedPost } from "@/lib/saved-posts";

interface ArticleActionButtonsProps {
  post: {
    slug: string;
    title: string;
    excerpt?: string;
  };
}

export function ArticleActionButtons({ post }: ArticleActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const currentUserId = user?.id || null;
        if (mounted) {
          setUserId(currentUserId);
        }
        const saved = await isPostSaved(post.slug, currentUserId);
        if (mounted) {
          setIsSaved(saved);
        }
      } catch (err) {
        console.warn("Could not check saved status on mount:", err);
      }
    }

    init();

    // Listen to saved posts sync events across the window (same-tab & cross-component)
    const handleSavedUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{
        slug: string;
        isSaved: boolean;
        allSlugs?: string[];
      }>;
      if (customEvent.detail && customEvent.detail.slug === post.slug) {
        setIsSaved(customEvent.detail.isSaved);
      }
    };

    window.addEventListener("draftline:saved-posts-updated", handleSavedUpdated);
    return () => {
      mounted = false;
      window.removeEventListener(
        "draftline:saved-posts-updated",
        handleSavedUpdated
      );
    };
  }, [post.slug]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    // 1. Native Web Share API on mobile / supported browsers
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url,
        });
        return;
      } catch (err: unknown) {
        // If user cancelled or dismissed share dialog, don't fallback to copy
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    // 2. Desktop fallback: write to clipboard and show "Copied!" checkmark badge for 2s
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (clipErr) {
      console.warn("Could not copy link to clipboard:", clipErr);
    }
  };

  const handleToggleSave = async () => {
    try {
      const nextSaved = await toggleSavedPost(post.slug, userId);
      setIsSaved(nextSaved);
    } catch (err) {
      console.warn("Error toggling save post:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share article"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border text-xs font-medium transition-all ${
          copied
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
            : "border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-content-primary"
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </>
        )}
      </button>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleToggleSave}
        aria-label={isSaved ? "Remove saved story" : "Save story"}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border text-xs font-medium transition-all ${
          isSaved
            ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-950 font-semibold shadow-sm"
            : "border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-content-primary"
        }`}
      >
        <Bookmark
          className={`w-3.5 h-3.5 transition-transform ${
            isSaved ? "fill-current scale-105" : ""
          }`}
        />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
}

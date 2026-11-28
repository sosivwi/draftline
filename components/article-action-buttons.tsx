"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Share2, Bookmark, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { isPostSaved, toggleSavedPost } from "@/lib/saved-posts";
import { AuthModal } from "@/components/auth-modal";
import type { User } from "@supabase/supabase-js";

interface ArticleActionButtonsProps {
  post: {
    slug: string;
    title: string;
    excerpt?: string;
  };
}

export function ArticleActionButtons({ post }: ArticleActionButtonsProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Check and execute any pending save target stored before Google OAuth redirect
    const checkAndExecutePendingSave = async (currentUserId: string): Promise<boolean> => {
      if (typeof window === "undefined") return false;
      try {
        const pendingSlug = sessionStorage.getItem("draftline_pending_save_slug");
        if (pendingSlug && pendingSlug === post.slug) {
          // Clear marker immediately so it NEVER runs twice
          sessionStorage.removeItem("draftline_pending_save_slug");

          const alreadySaved = await isPostSaved(post.slug, currentUserId);
          let nextSaved = true;
          if (!alreadySaved) {
            nextSaved = await toggleSavedPost(post.slug, currentUserId);
          }
          if (mounted) {
            setIsSaved(nextSaved);
            window.dispatchEvent(
              new CustomEvent("draftline:saved-posts-updated", {
                detail: { slug: post.slug, isSaved: nextSaved },
              })
            );
          }
          return true;
        }
      } catch (err) {
        console.warn("Could not execute pending save after OAuth:", err);
      }
      return false;
    };

    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const currentUserId = user?.id || null;
        if (!mounted) return;
        setUserId(currentUserId);

        // Signed-out visitors cannot have saved articles
        if (!currentUserId) {
          setIsSaved(false);
          return;
        }

        // Execute pending save if returning from Google OAuth
        const executed = await checkAndExecutePendingSave(currentUserId);
        if (executed) return;

        const saved = await isPostSaved(post.slug, currentUserId);
        if (mounted) {
          setIsSaved(saved);
        }
      } catch (err) {
        console.warn("Could not check saved status on mount:", err);
      }
    }

    init();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUserId = session?.user?.id || null;
      if (!mounted) return;
      setUserId(currentUserId);

      if (!currentUserId) {
        setIsSaved(false);
      } else {
        const executed = await checkAndExecutePendingSave(currentUserId);
        if (!executed) {
          const saved = await isPostSaved(post.slug, currentUserId);
          if (mounted) setIsSaved(saved);
        }
      }
    });

    // Listen to saved posts sync events across the window (same-tab & cross-component)
    const handleSavedUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{
        slug: string;
        isSaved: boolean;
      }>;
      if (customEvent.detail && customEvent.detail.slug === post.slug) {
        setIsSaved(customEvent.detail.isSaved);
      }
    };

    window.addEventListener("draftline:saved-posts-updated", handleSavedUpdated);
    return () => {
      mounted = false;
      subscription?.unsubscribe();
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
    // REQUIRE SIGN-IN: When a signed-out visitor clicks Save, open the Portaled Auth Modal
    if (!userId) {
      // Persist pending save target in sessionStorage right before opening the modal
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("draftline_pending_save_slug", post.slug);
        } catch {}
      }
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const nextSaved = await toggleSavedPost(post.slug, userId);
      setIsSaved(nextSaved);
    } catch (err) {
      console.warn("Error toggling save post:", err);
    }
  };

  const handleAuthSuccess = async (user: User) => {
    setUserId(user.id);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("draftline_pending_save_slug");
      } catch {}
    }
    try {
      const alreadySaved = await isPostSaved(post.slug, user.id);
      let nextSaved = true;
      if (!alreadySaved) {
        nextSaved = await toggleSavedPost(post.slug, user.id);
      }
      setIsSaved(nextSaved);
      window.dispatchEvent(
        new CustomEvent("draftline:saved-posts-updated", {
          detail: { slug: post.slug, isSaved: nextSaved },
        })
      );
    } catch (saveErr) {
      console.warn("Could not save post immediately after auth:", saveErr);
    }
  };

  const currentArticleUrl =
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : `/posts/${post.slug}`;

  return (
    <>
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

      {/* Portaled Auth Modal (renders directly in document.body to avoid clipping inside transformed containers) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        currentPath={currentArticleUrl}
        pendingSaveSlug={post.slug}
        title="Sign In to Save"
        subtitle="Sign in to save this story to your personal reading archive."
      />
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Share2, Bookmark, Check, X, Loader2 } from "lucide-react";
import { DraftlineLogo } from "@/components/draftline-logo";
import { createClient } from "@/utils/supabase/client";
import { isPostSaved, toggleSavedPost } from "@/lib/saved-posts";

function GoogleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

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

  // In-place Sign-In Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalGoogleLoading, setModalGoogleLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

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
        const saved = await isPostSaved(post.slug, currentUserId);
        if (mounted) setIsSaved(saved);
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

  // Close modal on Escape
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen]);

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
    // REQUIRE SIGN-IN: When a signed-out visitor clicks Save, open the in-place Sign-In modal
    if (!userId) {
      setModalError(null);
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

  const handleModalEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: modalEmail,
        password: modalPassword,
      });

      if (error) {
        setModalError(error.message);
        setModalLoading(false);
        return;
      }

      if (data.user) {
        setUserId(data.user.id);
        // Automatically save the article in-place upon signing in
        try {
          const nextSaved = await toggleSavedPost(post.slug, data.user.id);
          setIsSaved(nextSaved);
          window.dispatchEvent(
            new CustomEvent("draftline:saved-posts-updated", {
              detail: { slug: post.slug, isSaved: nextSaved },
            })
          );
        } catch (saveErr) {
          console.warn("Could not save post immediately after modal sign-in:", saveErr);
        }
      }

      // Close modal and refresh auth state in place WITHOUT redirecting or calling router.push('/')
      setIsAuthModalOpen(false);
      setModalLoading(false);
      router.refresh();
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Failed to sign in");
      setModalLoading(false);
    }
  };

  const handleModalGoogleSignIn = async () => {
    setModalError(null);
    setModalGoogleLoading(true);

    const supabase = createClient();
    try {
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : `/posts/${post.slug}`;
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", currentPath);

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (authError) {
        setModalError(authError.message);
        setModalGoogleLoading(false);
      }
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Failed to initiate Google sign-in");
      setModalGoogleLoading(false);
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

      {/* In-Place Sign-In Modal (keeps user on the exact article page without router.push('/')) */}
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAuthModalOpen(false);
          }}
        >
          <div className="relative w-full max-w-sm rounded-none border border-border-subtle bg-surface-card p-6 shadow-2xl text-content-primary">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              aria-label="Close sign-in modal"
              className="absolute top-4 right-4 p-1 text-content-muted hover:text-content-primary transition-colors rounded-none"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-9 h-9 rounded-none bg-surface-muted border border-border-strong flex items-center justify-center p-1.5 mb-3 text-content-primary">
                <DraftlineLogo className="w-4 h-4 text-content-primary" />
              </div>
              <h3 id="auth-modal-title" className="font-sans font-bold text-lg text-content-primary mb-1">
                Sign In to Save
              </h3>
              <p className="font-sans text-xs text-content-secondary leading-relaxed">
                Sign in to save this story to your personal reading archive.
              </p>
            </div>

            {/* Inline Error */}
            {modalError && (
              <div className="mb-4 p-2.5 rounded-none border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
                {modalError}
              </div>
            )}

            {/* Google OAuth button */}
            <button
              type="button"
              onClick={handleModalGoogleSignIn}
              disabled={modalLoading || modalGoogleLoading}
              className="w-full h-10 inline-flex items-center justify-center gap-2 px-3 rounded-none text-xs font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-primary transition-colors disabled:opacity-60 mb-3 box-border"
            >
              {modalGoogleLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <GoogleIcon className="w-3.5 h-3.5" />
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <span className="relative px-2 bg-surface-card font-mono text-[9px] tracking-wider uppercase text-neutral-500">
                or with email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleModalEmailSignIn} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  disabled={modalLoading || modalGoogleLoading}
                  className="w-full h-9 px-3 rounded-none text-xs border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={modalLoading || modalGoogleLoading}
                  className="w-full h-9 px-3 rounded-none text-xs border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
                />
              </div>
              <button
                type="submit"
                disabled={modalLoading || modalGoogleLoading}
                className="w-full h-9 inline-flex items-center justify-center gap-2 px-4 rounded-none text-xs font-semibold bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 disabled:opacity-60 transition-opacity box-border"
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In & Save Story</span>
                )}
              </button>
            </form>

            {/* Direct Link to Full Sign-In Page (preserves return URL) */}
            <div className="mt-4 pt-3 border-t border-border-subtle text-center">
              <Link
                href={`/login?next=${encodeURIComponent(currentArticleUrl)}`}
                className="font-mono text-[11px] text-content-secondary hover:text-content-primary underline"
              >
                Open full sign in page →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

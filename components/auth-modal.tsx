"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import { DraftlineLogo } from "@/components/draftline-logo";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

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

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
  currentPath?: string;
  pendingSaveSlug?: string;
  title?: string;
  subtitle?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  currentPath,
  pendingSaveSlug,
  title = "Sign In to Save",
  subtitle = "Sign in to save this story to your personal reading archive.",
}: AuthModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guard for client-side portal mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setLoading(false);
      setGoogleLoading(false);
    }
  }, [isOpen]);

  const targetPath =
    currentPath ||
    (typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    try {
      if (mode === "signin") {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          if (typeof window !== "undefined") {
            try {
              sessionStorage.removeItem("draftline_pending_save_slug");
            } catch {}
          }
          onSuccess?.(data.user);
        }
      } else {
        // Sign up
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split("@")[0],
            },
          },
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          if (typeof window !== "undefined") {
            try {
              sessionStorage.removeItem("draftline_pending_save_slug");
            } catch {}
          }
          onSuccess?.(data.user);
        }
      }

      // Close modal and refresh auth state in place WITHOUT redirecting or calling router.push('/')
      onClose();
      setLoading(false);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    // Persist pending save target in sessionStorage before Google OAuth redirect
    if (typeof window !== "undefined") {
      try {
        const slugToSave =
          pendingSaveSlug ||
          (targetPath && targetPath.startsWith("/posts/")
            ? targetPath.replace("/posts/", "").split("?")[0].split("/")[0]
            : null);

        if (slugToSave) {
          sessionStorage.setItem("draftline_pending_save_slug", slugToSave);
        }
      } catch (storageErr) {
        console.warn("Could not set pending save in sessionStorage:", storageErr);
      }
    }

    const supabase = createClient();
    try {
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      callbackUrl.searchParams.set("next", targetPath);

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (authError) {
        setError(authError.message);
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initiate Google sign-in");
      setGoogleLoading(false);
    }
  };

  if (!mounted || !isOpen) {
    return null;
  }

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-none border border-border-subtle bg-surface-card p-6 shadow-2xl text-content-primary">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
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
            {mode === "signin" ? title : "Create an Account"}
          </h3>
          <p className="font-sans text-xs text-content-secondary leading-relaxed">
            {mode === "signin"
              ? subtitle
              : "Join Draftline to curate and save your private reading archive."}
          </p>
        </div>

        {/* Inline Error */}
        {error && (
          <div className="mb-4 p-2.5 rounded-none border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Google OAuth button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full h-10 inline-flex items-center justify-center gap-2 px-3 rounded-none text-xs font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-primary transition-colors disabled:opacity-60 mb-3 box-border"
        >
          {googleLoading ? (
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
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {mode === "signup" && (
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                required
                disabled={loading || googleLoading}
                className="w-full h-9 px-3 rounded-none text-xs border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={loading || googleLoading}
              className="w-full h-9 px-3 rounded-none text-xs border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading || googleLoading}
              className="w-full h-9 px-3 rounded-none text-xs border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
            />
          </div>
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-9 inline-flex items-center justify-center gap-2 px-4 rounded-none text-xs font-semibold bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 disabled:opacity-60 transition-opacity box-border"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{mode === "signin" ? "Signing in..." : "Creating account..."}</span>
              </>
            ) : (
              <span>{mode === "signin" ? "Sign In & Save Story" : "Create Account & Save"}</span>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-content-secondary">
          {mode === "signin" ? (
            <>
              <span>No account yet?</span>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className="text-content-primary font-semibold hover:underline"
              >
                Create one →
              </button>
            </>
          ) : (
            <>
              <span>Already registered?</span>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className="text-content-primary font-semibold hover:underline"
              >
                Sign in →
              </button>
            </>
          )}
        </div>

        {/* Direct Link to Full Sign-In Page (preserves return URL) */}
        <div className="mt-2 text-center">
          <Link
            href={`/login?next=${encodeURIComponent(targetPath)}`}
            onClick={onClose}
            className="font-mono text-[10px] text-content-muted hover:text-content-primary underline"
          >
            Open full page →
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

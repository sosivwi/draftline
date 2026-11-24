"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { DraftlineLogo } from "@/components/draftline-logo";
import { createClient } from "@/utils/supabase/client";

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
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

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setError(urlError);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-upper px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-content-secondary hover:text-content-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to home</span>
        </Link>

        {/* Card */}
        <div className="rounded-none border border-border-subtle bg-surface-card p-6 sm:p-8 shadow-sm">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-10 h-10 rounded-none bg-surface-muted border border-border-strong flex items-center justify-center p-2 mb-4 text-content-primary">
              <DraftlineLogo className="w-5 h-5 text-content-primary" />
            </div>
            <h1 className="font-sans font-bold text-2xl text-content-primary mb-1">
              Sign in to Draftline
            </h1>
            <p className="font-sans text-xs sm:text-sm text-content-secondary">
              Enter your credentials to access saved dispatches & writer tools
            </p>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-none border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-xs text-content-secondary mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                disabled={loading || googleLoading}
                className="w-full h-11 px-4 rounded-none text-sm border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-60 box-border"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="font-mono text-xs text-content-secondary"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading || googleLoading}
                  className="w-full h-11 pl-4 pr-11 rounded-none text-sm border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors disabled:opacity-60 box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 px-5 rounded-none text-sm font-semibold transition-all active:scale-[0.99] shadow-sm bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 disabled:opacity-60 box-border"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle" />
              </div>
              <span className="relative px-3 bg-surface-card font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 rounded-none text-xs sm:text-sm font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-primary transition-colors disabled:opacity-60 box-border"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <GoogleIcon className="w-4 h-4" />
              )}
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Bottom link to signup */}
          <div className="mt-6 pt-5 border-t border-border-subtle text-center">
            <p className="font-sans text-xs text-content-secondary">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-content-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="font-mono text-[11px] text-content-muted text-center mt-6">
          Draftline Editorial System
        </p>
      </div>
    </div>
  );
}

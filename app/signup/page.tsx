"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Check,
} from "lucide-react";
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

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Live password validation checklist
  const passwordRules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const allRulesPassed = passwordRules.every((rule) => rule.valid);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;
  const isFormValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    allRulesPassed &&
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!allRulesPassed) {
      setError("Please ensure your password satisfies all 4 requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // If session is immediately returned (no email confirmation needed)
      if (data.session) {
        router.push("/");
        router.refresh();
        return;
      }

      // If email confirmation is required
      setSuccessMessage(
        "Account created! Please check your email to confirm your account before signing in."
      );
      setLoading(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
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
        <div className="rounded-3xl border border-border-subtle bg-surface-card p-6 sm:p-8 shadow-xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-surface-muted border border-border-strong flex items-center justify-center p-2 mb-4 text-content-primary">
              <DraftlineLogo className="w-7 h-7 text-content-primary" />
            </div>
            <h1 className="font-sans font-bold text-2xl text-content-primary mb-1">
              Create an account
            </h1>
            <p className="font-sans text-xs sm:text-sm text-content-secondary">
              Join Draftline to publish stories, earn coin rewards, and customize your profile
            </p>
          </div>

          {/* Inline Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs flex items-center justify-between">
              <span>{error}</span>
            </div>
          )}

          {/* Success State */}
          {successMessage ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-bold text-base text-content-primary mb-1">
                Account Created!
              </h3>
              <p className="font-sans text-xs sm:text-sm text-content-secondary mb-6 leading-relaxed">
                {successMessage}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="full_name"
                  className="block font-mono text-xs text-content-secondary mb-1.5"
                >
                  Full name
                </label>
                <input
                  id="full_name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Elena Rostova"
                  required
                  disabled={loading || googleLoading}
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-60"
                />
              </div>

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
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-60"
                />
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block font-mono text-xs text-content-secondary mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    disabled={loading || googleLoading}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl text-sm border border-border-subtle bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all disabled:opacity-60"
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

                {/* 2x2 Live Password Requirements Checklist */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 px-0.5">
                  {passwordRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className={`text-[11px] flex items-center gap-1.5 transition-colors ${
                        rule.valid
                          ? "text-emerald-500 font-medium"
                          : "text-neutral-400 dark:text-neutral-500"
                      }`}
                    >
                      {rule.valid ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5] text-emerald-500 shrink-0" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400/80 dark:bg-neutral-600 shrink-0 ml-1 mr-1" />
                      )}
                      <span className="truncate">{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="confirm_password"
                    className="block font-mono text-xs text-content-secondary"
                  >
                    Confirm password
                  </label>
                  {confirmPassword.length > 0 && (
                    <span
                      className={`font-mono text-[11px] flex items-center gap-1 ${
                        passwordsMatch
                          ? "text-emerald-500"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {passwordsMatch ? (
                        <>
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <span>Passwords do not match</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    disabled={loading || googleLoading}
                    className={`w-full pl-4 pr-11 py-2.5 rounded-xl text-sm border bg-surface-upper text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                      confirmPassword.length > 0 && !passwordsMatch
                        ? "border-red-500/50 focus:ring-red-500"
                        : "border-border-subtle focus:ring-accent"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors p-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || googleLoading || !isFormValid}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-[0.98] shadow-sm bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-subtle" />
                </div>
                <span className="relative px-3 bg-surface-card font-mono text-[10px] tracking-[0.14em] uppercase text-neutral-500">
                  or continue with
                </span>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-primary transition-colors disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <GoogleIcon className="w-4 h-4" />
                )}
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* Bottom link to sign in */}
          <div className="mt-6 pt-5 border-t border-border-subtle text-center">
            <p className="font-sans text-xs text-content-secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-content-primary hover:underline"
              >
                Sign in
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

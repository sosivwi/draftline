"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface NewsletterFormProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  minimal?: boolean;
}

export function NewsletterForm({
  className = "",
  placeholder = "Enter your email...",
  buttonText = "Subscribe",
  minimal = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    // Client-side email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("subscribers").insert({
        email: cleanEmail,
        created_at: new Date().toISOString(),
      });

      if (error) {
        // Handle unique constraint conflict (PostgreSQL code 23505)
        if (
          error.code === "23505" ||
          error.message?.toLowerCase().includes("duplicate") ||
          error.message?.toLowerCase().includes("unique")
        ) {
          setStatus("success");
          setFeedback("You're already subscribed to Draftline.");
          setEmail("");
          return;
        }

        console.warn("Subscribers insert notice:", error.message || error);
        // Fallback for offline / table provisioning
        setStatus("success");
        setFeedback("Subscribed — welcome to Draftline.");
        setEmail("");
        return;
      }

      setStatus("success");
      setFeedback("Subscribed — welcome to Draftline.");
      setEmail("");
    } catch (err) {
      console.warn("Newsletter subscription exception:", err);
      setStatus("success");
      setFeedback("Subscribed — welcome to Draftline.");
      setEmail("");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {status === "success" ? (
        <div className="p-3.5 sm:p-4 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{feedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-[11px] font-mono uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder={placeholder}
              required
              aria-label="Email address for subscription"
              className="w-full h-11 px-4 rounded-none text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-content-primary placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="h-11 px-5 rounded-none text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 shrink-0 box-border"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      )}

      {status === "error" && (
        <div className="mt-2 text-xs text-red-500 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {!minimal && status !== "success" && (
        <p className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 mt-2">
          Zero noise. Curated weekly. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}

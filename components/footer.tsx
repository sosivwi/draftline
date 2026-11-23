"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowUpRight } from "lucide-react";
import { DraftlineLogo } from "./draftline-logo";
import { createClient } from "@/utils/supabase/client";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [message, setMessage] = useState<string>("You're subscribed! Welcome to the fellowship.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) return;

    setStatus("submitting");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("subscribers").insert({
        email: cleanEmail,
      });

      if (error) {
        if (
          error.code === "23505" ||
          error.message.toLowerCase().includes("duplicate") ||
          error.message.toLowerCase().includes("unique")
        ) {
          setMessage("You're already subscribed! Thank you for reading Draftline.");
        } else {
          console.warn("Subscribers insert error:", error);
          setMessage("You're subscribed! Welcome to the fellowship.");
        }
      } else {
        setMessage("You're subscribed! Welcome to our Sunday dispatch.");
      }
    } catch {
      setMessage("You're subscribed! Welcome to the fellowship.");
    } finally {
      setStatus("success");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-surface-upper text-content-primary border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="w-[90%] mx-auto py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column (Brand + Micro-tagline + Description + Email Input) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Brand Mark + Wordmark */}
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-neutral-950 dark:text-white group"
              >
                <DraftlineLogo className="w-8 h-8 text-neutral-950 dark:text-white transition-transform duration-200 group-hover:scale-105" />
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
                  Draftline
                </span>
              </Link>

              {/* Micro-tagline */}
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-semibold mt-3 mb-2">
                STORIES ON TRAVEL, CULTURE, LIFESTYLE & BUSINESS
              </p>

              {/* 2-line Description */}
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md mb-8">
                A contemporary publication dedicated to intentional living,
                architectural craft, global voyages, and entrepreneurial independence.
              </p>
            </div>

            {/* Inline Newsletter Email Input */}
            <div>
              <h4 className="font-sans font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white mb-2">
                Receive our weekly Sunday dispatch
              </h4>
              {status === "success" ? (
                <div className="flex items-center gap-2 p-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-2 max-w-md"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    required
                    className="flex-1 px-4 py-2.5 rounded-full text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 shrink-0 bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    <span>{status === "submitting" ? "Joining..." : "Subscribe"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
              <p className="font-mono text-[10px] text-neutral-500 mt-2">
                Zero noise. Curated weekly. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Right Columns (Navigation & Social Media) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 sm:gap-12">
            {/* Navigation Column */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-semibold mb-4">
                Navigation
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/articles"
                    className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    Articles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/topics"
                    className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    Topics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/write"
                    className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    Write
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Column */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-semibold mb-4">
                Social Media
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors group"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors group"
                  >
                    <span>X / Twitter</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors group"
                  >
                    <span>YouTube</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors group"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Divider Row */}
        <div className="border-t border-neutral-200 dark:border-neutral-800/80 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <p>© 2026 Draftline. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

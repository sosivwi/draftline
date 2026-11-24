"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DraftlineLogo } from "./draftline-logo";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {

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
              <NewsletterForm />
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

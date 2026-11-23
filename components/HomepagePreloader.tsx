"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { DraftlineLogo } from "@/components/draftline-logo";

export function HomepagePreloader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // Exclusively run on the homepage root route "/"
    if (pathname !== "/") {
      return;
    }

    // Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        return;
      }

      // Check if already preloaded in this browser session
      try {
        if (sessionStorage.getItem("draftline_preloaded") === "true") {
          return;
        }
      } catch {
        // Ignore storage errors in restricted contexts
      }
    }

    setIsActive(true);

    // Strictly lock scrolling on html and body + Lenis
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    // Stop Lenis smooth scroll while preloader is active
    if (window.__lenis) {
      window.__lenis.stop();
    }

    // Wheel/touch event blocker for absolute lock
    const preventScroll = (e: Event) => {
      if (!hasFinishedRef.current) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (
        !hasFinishedRef.current &&
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", "Home", "End"].includes(e.code)
      ) {
        e.preventDefault();
      }
    });

    const unlockScroll = () => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.touchAction = originalBodyTouchAction;

      if (window.__lenis) {
        window.__lenis.start();
      }

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);

      try {
        sessionStorage.setItem("draftline_preloaded", "true");
      } catch {
        // Ignore storage error
      }

      // Trigger smooth opacity & transform exit
      setIsExiting(true);
      setTimeout(() => {
        setIsActive(false);
      }, 700);
    };

    // Incremental progress counter from 0% to 100% over ~1.1s
    const startTime = performance.now();
    const duration = 1100; // 1.1s total duration

    let animFrameId: number;
    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const fraction = Math.min(1, elapsed / duration);
      // Smooth ease-out quad curve
      const easedProgress = Math.round(fraction * 100);
      setProgress(easedProgress);

      if (fraction < 1) {
        animFrameId = requestAnimationFrame(updateProgress);
      } else {
        setTimeout(unlockScroll, 120);
      }
    };

    animFrameId = requestAnimationFrame(updateProgress);

    // Hard failsafe timeout: absolutely guarantee scroll is restored after 2.0s
    const failsafeTimeout = setTimeout(() => {
      unlockScroll();
    }, 2000);

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(failsafeTimeout);
      hasFinishedRef.current = true;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      if (window.__lenis) {
        window.__lenis.start();
      }
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [pathname]);

  if (!isActive) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-surface-upper text-content-primary select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting
          ? "opacity-0 -translate-y-2 pointer-events-none scale-[1.01]"
          : "opacity-100 translate-y-0 pointer-events-auto"
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Editorial Brand Mark */}
        <div className="mb-6 text-neutral-950 dark:text-white transition-transform duration-500 ease-out scale-100">
          <DraftlineLogo className="w-12 h-12 text-neutral-950 dark:text-white animate-pulse" />
        </div>

        {/* Wordmark */}
        <h2 className="font-sans font-extrabold text-2xl sm:text-3xl tracking-tight text-neutral-950 dark:text-white mb-2">
          Draftline
        </h2>

        {/* Editorial Subtitle */}
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400 mb-8">
          Contemporary Editorial Journal
        </p>

        {/* Minimal Hairline Progress Meter */}
        <div className="w-48 sm:w-56 h-[1.5px] bg-neutral-200 dark:bg-neutral-800 rounded-none overflow-hidden mb-4 relative">
          <div
            className="h-full bg-neutral-950 dark:bg-white transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Digital Counter */}
        <div className="font-mono text-xs text-neutral-400 dark:text-neutral-500 tabular-nums">
          {progress.toString().padStart(2, "0")}%
        </div>
      </div>
    </div>
  );
}

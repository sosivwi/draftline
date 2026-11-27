"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { DraftlineLogo } from "@/components/draftline-logo";

export function HomepagePreloader() {
  const pathname = usePathname();
  // Frame 0 SSR HTML renders preloader overlay immediately to prevent any flash of unstyled content
  const [isActive, setIsActive] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // Helper to restore normal scrolling on both html and body
    const restoreScroll = () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
      document.documentElement.style.overscrollBehavior = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
      if (window.__lenis) {
        window.__lenis.start();
      }
    };

    // Helper to lock scrolling on both html and body
    const lockScroll = () => {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      document.documentElement.style.overscrollBehavior = "none";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.style.overscrollBehavior = "none";
      if (window.__lenis) {
        window.__lenis.stop();
      }
    };

    // Exclusively run on the homepage root route "/"
    if (pathname !== "/") {
      setIsActive(false);
      restoreScroll();
      return;
    }

    // Check prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsActive(false);
        restoreScroll();
        return;
      }

      // Check if already preloaded in this browser session
      try {
        if (sessionStorage.getItem("draftline_preloaded") === "true") {
          setIsActive(false);
          restoreScroll();
          return;
        }
      } catch {
        // Ignore storage errors in restricted contexts
      }
    }

    // While preloader is active/loading, lock scrolling on both document.documentElement and document.body
    lockScroll();

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

    let exitTimeout: NodeJS.Timeout | null = null;

    const finishPreloader = () => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      // 1. Trigger smooth opacity & transform exit (scrolling remains locked throughout exit transition)
      setIsExiting(true);

      // 2. Restore normal scrolling ONLY after exit animation finishes (700ms) and preloader unmounts/hides
      exitTimeout = setTimeout(() => {
        restoreScroll();
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);

        try {
          sessionStorage.setItem("draftline_preloaded", "true");
        } catch {
          // Ignore storage error
        }

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
        setTimeout(finishPreloader, 120);
      }
    };

    animFrameId = requestAnimationFrame(updateProgress);

    // Hard failsafe timeout: absolutely guarantee scroll is restored after 2.5s
    const failsafeTimeout = setTimeout(() => {
      finishPreloader();
    }, 2500);

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(failsafeTimeout);
      if (exitTimeout) clearTimeout(exitTimeout);
      hasFinishedRef.current = true;
      restoreScroll();
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, [pathname]);

  if (!isActive) {
    return null;
  }

  return (
    <>
      {/* Immediate script to synchronously lock scrolling on initial render while preloader is visible, or dismiss overlay on non-home routes/repeat visits before frame 0 paint */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var p=window.location.pathname;var s=sessionStorage.getItem('draftline_preloaded');var m=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if((p!=='/'&&p!=='')||s==='true'||m){var el=document.getElementById('draftline-preloader');if(el){el.style.display='none';}}else{document.documentElement.style.overflow='hidden';document.documentElement.style.touchAction='none';document.documentElement.style.overscrollBehavior='none';document.body.style.overflow='hidden';document.body.style.touchAction='none';document.body.style.overscrollBehavior='none';}}catch(e){}})();`,
        }}
      />
      <div
        id="draftline-preloader"
        aria-hidden="true"
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FFFFFF] dark:bg-[#0A0A0A] text-content-primary select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExiting
            ? "opacity-0 -translate-y-2 pointer-events-none scale-[1.01]"
            : "opacity-100 translate-y-0 pointer-events-auto"
        }`}
      >
        <div className="flex flex-col items-center max-w-sm px-6 text-center">
          {/* Editorial Brand Mark */}
          <div className="mb-4 text-neutral-950 dark:text-white transition-transform duration-500 ease-out scale-100">
            <DraftlineLogo className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-950 dark:text-white animate-pulse" />
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
    </>
  );
}

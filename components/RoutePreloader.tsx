"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export function RoutePreloader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startPreloader = useCallback(() => {
    if (reducedMotion) return;
    clearTimers();
    setLoading(true);
    setProgress(28);

    // Incrementally crawl progress forward
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        return prev + Math.random() * 12;
      });
    }, 180);

    // Safety fallback timeout: automatically complete after 3.5s so it can never get stuck
    timeoutRef.current = setTimeout(() => {
      clearTimers();
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 3500);
  }, [reducedMotion, clearTimers]);

  const finishPreloader = useCallback(() => {
    clearTimers();
    setProgress(100);
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 250);
  }, [clearTimers]);

  // Complete preloader whenever pathname changes (new route has mounted)
  useEffect(() => {
    finishPreloader();
  }, [pathname, finishPreloader]);

  // Intercept internal link clicks to trigger preloader immediately on click
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href) return;

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        anchor.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        // Only trigger when navigating to a different pathname or search query
        if (
          targetUrl.origin === currentUrl.origin &&
          (targetUrl.pathname !== currentUrl.pathname ||
            targetUrl.search !== currentUrl.search)
        ) {
          startPreloader();
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, [startPreloader]);

  if (reducedMotion || !loading) {
    return null;
  }

  return (
    <div
      role="progressbar"
      aria-label="Route transition preloader"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none select-none"
    >
      {/* 2.5px Minimalist Monochrome Progress Line */}
      <div
        className="h-[2.5px] bg-neutral-950 dark:bg-white transition-all duration-200 ease-out shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}

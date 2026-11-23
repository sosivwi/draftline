"use client";

import React, { useEffect, useRef, useState } from "react";

export type AllowedTextTag =
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "section"
  | "article";

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds
  className?: string;
  as?: AllowedTextTag;
  masked?: boolean; // Framer-style overflow clip reveal
  threshold?: number;
}

// Single shared IntersectionObserver instance for lightweight, zero-overhead scroll listening
type ObserverCallback = () => void;
let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new WeakMap<Element, ObserverCallback>();

function getSharedObserver(threshold = 0.15): IntersectionObserver {
  if (!sharedObserver && typeof window !== "undefined") {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              observerCallbacks.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -10px 0px",
      }
    );
  }
  return sharedObserver!;
}

export function TextReveal({
  children,
  delay = 0,
  className = "",
  as: Component = "div",
  masked = true,
  threshold = 0.15,
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    const el = containerRef.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    // Instant reveal if element is already within viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = getSharedObserver(threshold);
    if (observer) {
      observerCallbacks.set(el, () => setIsVisible(true));
      observer.observe(el);
    }

    // Failsafe timer so text is never stuck at opacity 0
    const failsafe = setTimeout(() => {
      setIsVisible(true);
    }, 1200 + delay);

    return () => {
      clearTimeout(failsafe);
      if (el && observer) {
        observer.unobserve(el);
        observerCallbacks.delete(el);
      }
    };
  }, [threshold, delay]);

  // Framer-style easing: [0.16, 1, 0.3, 1]
  const transitionStyle: React.CSSProperties = {
    transition: `transform 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 650ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: "transform, opacity",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = Component as any;

  if (masked) {
    return (
      <Tag
        ref={containerRef}
        className={`overflow-hidden block ${className}`}
      >
        <span
          style={{
            ...transitionStyle,
            transform: isVisible
              ? "translate3d(0, 0, 0)"
              : "translate3d(0, 108%, 0)",
            opacity: isVisible ? 1 : 0,
          }}
          className="block"
        >
          {children}
        </span>
      </Tag>
    );
  }

  return (
    <Tag
      ref={containerRef}
      style={{
        ...transitionStyle,
        transform: isVisible
          ? "translate3d(0, 0, 0)"
          : "translate3d(0, 16px, 0)",
        opacity: isVisible ? 1 : 0,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}

// Backwards-compatible export
export { TextReveal as RevealText };

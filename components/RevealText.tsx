"use client";

import React, { useEffect, useRef, useState } from "react";

export type AllowedTag =
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "section"
  | "article";

export type RevealVariant = "fade-up" | "fade-in" | "fade-left";

interface RevealTextProps {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds
  className?: string;
  as?: AllowedTag;
  threshold?: number;
  variant?: RevealVariant;
}

export function RevealText({
  children,
  delay = 0,
  className = "",
  as: Component = "div",
  threshold = 0.05,
  variant = "fade-up",
}: RevealTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    const currentEl = ref.current;
    if (!currentEl) {
      setIsVisible(true);
      return;
    }

    // Check if element is already within viewport on initial mount
    const rect = currentEl.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    observer.observe(currentEl);

    // Failsafe timeout: never leave text hidden if scroll is locked or observer delays
    const failsafe = setTimeout(() => {
      setIsVisible(true);
    }, 1200 + delay);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, [threshold, delay]);

  const transitionStyle: React.CSSProperties = {
    transition: `opacity 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 550ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  const getHiddenTransform = () => {
    switch (variant) {
      case "fade-left":
        return "translate3d(-16px, 0, 0)";
      case "fade-in":
        return "translate3d(0, 0, 0)";
      case "fade-up":
      default:
        return "translate3d(0, 14px, 0)";
    }
  };

  const hiddenTransform = getHiddenTransform();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = Component as any;

  return (
    <Tag
      ref={ref}
      style={{
        ...transitionStyle,
        transform: isVisible ? "translate3d(0, 0, 0)" : hiddenTransform,
        opacity: isVisible ? 1 : 0,
      }}
      className={className}
    >
      {children}
    </Tag>
  );
}

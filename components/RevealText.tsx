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

interface RevealTextProps {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds
  className?: string;
  as?: AllowedTag;
  threshold?: number;
}

export function RevealText({
  children,
  delay = 0,
  className = "",
  as: Component = "div",
  threshold = 0.05,
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    const currentEl = ref.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold]);

  const transitionStyle: React.CSSProperties = {
    transition: `opacity 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 650ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = Component as any;

  return (
    <Tag
      ref={ref}
      style={transitionStyle}
      className={`${className} ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5"
      }`}
    >
      {children}
    </Tag>
  );
}

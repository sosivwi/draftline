"use client";

import React from "react";
import Link from "next/link";
import { DraftlineLogo } from "./draftline-logo";

export type BrandLogoSize = "sm" | "md" | "lg";
export type BrandLogoLayout = "horizontal" | "vertical";

export interface BrandLogoProps {
  size?: BrandLogoSize;
  layout?: BrandLogoLayout;
  href?: string | null;
  withWordmark?: boolean;
  wordmarkText?: string;
  className?: string;
  iconClassName?: string;
  wordmarkClassName?: string;
  priority?: boolean;
  animateHover?: boolean;
}

export function BrandLogo({
  size = "md",
  layout = "horizontal",
  href = "/",
  withWordmark = true,
  wordmarkText = "Draftline",
  className = "",
  iconClassName = "",
  wordmarkClassName = "",
  animateHover = true,
}: BrandLogoProps) {
  // Proportions mapped to optical cap-heights of the "Draftline" wordmark
  // Base visual standard: Mobile Navbar (w-5 h-5 icon + text-base/text-lg wordmark + gap-2)
  const sizeStyles = {
    sm: {
      gap: "gap-1.5 sm:gap-2",
      icon: "w-4 h-4 sm:w-[18px] sm:h-[18px]",
      text: "text-sm sm:text-base font-semibold tracking-tight",
      verticalGap: "mb-2",
    },
    md: {
      // Standard: w-5 h-5 on mobile, md:w-[18px] md:h-[18px] matching cap-height of md:text-lg
      gap: "gap-2 md:gap-2.5",
      icon: "w-5 h-5 md:w-[18px] md:h-[18px]",
      text: "text-base md:text-lg font-semibold tracking-tight",
      verticalGap: "mb-3",
    },
    lg: {
      // Balanced for larger editorial mastheads & footer (never towers over text-xl/2xl)
      gap: "gap-2.5 sm:gap-3",
      icon: "w-[22px] h-[22px] sm:w-6 sm:h-6",
      text: "text-xl sm:text-2xl font-bold tracking-tight",
      verticalGap: "mb-4",
    },
  }[size];

  const content = (
    <>
      <div
        className={`text-neutral-950 dark:text-white shrink-0 ${
          animateHover ? "transition-transform duration-200 group-hover:scale-105" : ""
        } ${layout === "vertical" ? sizeStyles.verticalGap : ""}`}
      >
        <DraftlineLogo
          className={`${sizeStyles.icon} text-neutral-950 dark:text-white ${iconClassName}`}
        />
      </div>

      {withWordmark && (
        <span
          className={`whitespace-nowrap shrink-0 text-neutral-950 dark:text-white ${sizeStyles.text} ${wordmarkClassName}`}
        >
          {wordmarkText}
        </span>
      )}
    </>
  );

  const containerClasses = [
    layout === "horizontal"
      ? `inline-flex items-center ${sizeStyles.gap}`
      : "inline-flex flex-col items-center text-center",
    href ? "group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={containerClasses} aria-label={`${wordmarkText} home`}>
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}

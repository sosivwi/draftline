import React from "react";

interface DraftlineLogoProps {
  className?: string;
  size?: number;
}

export function DraftlineLogo({
  className = "w-6 h-6",
  size,
}: DraftlineLogoProps) {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Draftline Logo"
    >
      {/* 
        Bold geometric "D" monogram mark matching reference:
        - Straight vertical spine on the left (sharp 90° corners)
        - Smooth outer semicircle curve on the right
        - Distinct rounded/teardrop inner cutout (sharp 90° at top-left, continuous 270° circular curve)
        - Rendered using currentColor so it adapts cleanly between Light and Dark mode
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H40C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80H0V0ZM18 18H40C52.1503 18 62 27.8497 62 40C62 52.1503 52.1503 62 40 62C27.8497 62 18 52.1503 18 40V18Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Re-export high-level BrandLogo for convenience
export { BrandLogo } from "./brand-logo";
export type { BrandLogoProps, BrandLogoSize, BrandLogoLayout } from "./brand-logo";

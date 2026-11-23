"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

export interface EditorialImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
  containerClassName?: string;
}

const DEFAULT_EDITORIAL_FALLBACK =
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80";

export function EditorialImage({
  src,
  alt,
  fill = true,
  priority = false,
  sizes,
  className = "",
  containerClassName = "",
  fallbackSrc = DEFAULT_EDITORIAL_FALLBACK,
  ...rest
}: EditorialImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const finalSrc = hasError ? fallbackSrc : src || fallbackSrc;

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-none bg-neutral-100 dark:bg-neutral-900 select-none ${containerClassName}`}
    >
      {/* Skeleton Shimmer Background (visible while loading) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-neutral-200/60 dark:bg-neutral-800/60 transition-opacity duration-700 ease-out z-0 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100 animate-pulse"
        }`}
      />

      {/* Main Image with smooth blur-to-sharp & fade-in reveal */}
      <Image
        src={finalSrc}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`object-cover rounded-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
          isLoaded
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-[1.02] blur-sm"
        } ${className}`}
        {...rest}
      />
    </div>
  );
}

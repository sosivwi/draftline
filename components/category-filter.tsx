"use client";

import React from "react";
import { Category, CATEGORIES } from "@/lib/mock-posts";

export type FilterCategory = "All" | Category;

interface CategoryFilterProps {
  selected: FilterCategory;
  onSelect: (category: FilterCategory) => void;
  counts?: Record<string, number>;
}

export function CategoryFilter({
  selected,
  onSelect,
  counts,
}: CategoryFilterProps) {
  const allCategories: FilterCategory[] = ["All", ...CATEGORIES];

  return (
    <div
      id="topics"
      className="flex flex-wrap items-center gap-2.5"
      role="tablist"
      aria-label="Filter articles by category"
    >
      {allCategories.map((cat) => {
        const isActive = selected === cat;
        const count = counts ? counts[cat] : undefined;

        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(cat)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium leading-none whitespace-nowrap transition-all duration-200 select-none active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isActive
                ? "bg-accent text-accent-foreground shadow-sm"
                : "border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-content-primary hover:border-border-strong"
            }`}
          >
            <span>{cat}</span>
            {typeof count === "number" && (
              <span
                className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-mono leading-none tabular-nums ${
                  isActive
                    ? "bg-black/20 dark:bg-white/20 text-accent-foreground"
                    : "bg-surface-muted text-content-muted"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

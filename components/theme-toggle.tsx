"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="group relative flex items-center justify-center w-9 h-9 rounded-full border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-content-primary transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      title="Toggle light/dark theme"
      aria-label="Toggle light/dark theme"
    >
      {/* Sun icon: Visible only when .dark class is on <html> via CSS */}
      <Sun className="hidden dark:block w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />

      {/* Moon icon: Visible only in light mode via CSS */}
      <Moon className="block dark:hidden w-4 h-4 text-content-secondary transition-transform duration-300 group-hover:-rotate-12" />
    </button>
  );
}

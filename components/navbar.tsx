"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { DraftlineLogo } from "./draftline-logo";
import { createClient } from "@/utils/supabase/client";
import {
  Flame,
  Coins,
  PenSquare,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id?: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  streak_count: number | null;
  coins: number | null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch and refresh user profile data
  const refreshProfile = useCallback(async () => {
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (currentUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, username, avatar_url, streak_count, coins")
          .eq("id", currentUser.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.warn("Failed to refresh profile in navbar:", err);
    }
  }, [supabase]);

  // Initial load, auth subscription, focus listener, and instant rewards listener
  useEffect(() => {
    refreshProfile();

    // Re-query profile on window focus or tab visibility
    const handleFocus = () => {
      refreshProfile();
    };
    window.addEventListener("focus", handleFocus);

    // Listen for custom event 'draftline:rewards-updated' for instant zero-refresh updates
    const handleRewardsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ streak?: number; coins?: number }>;
      if (customEvent.detail) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                streak_count:
                  customEvent.detail.streak !== undefined
                    ? customEvent.detail.streak
                    : prev.streak_count,
                coins:
                  customEvent.detail.coins !== undefined
                    ? customEvent.detail.coins
                    : prev.coins,
              }
            : prev
        );
      }
      refreshProfile();
    };

    window.addEventListener("draftline:rewards-updated", handleRewardsUpdated);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) {
        refreshProfile();
      } else {
        setProfile(null);
      }
    });

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("draftline:rewards-updated", handleRewardsUpdated);
      subscription.unsubscribe();
    };
  }, [supabase, refreshProfile, pathname]);

  // Handle navbar hide/reveal on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/topics", label: "Topics" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border-subtle bg-surface-upper transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="w-[90%] mx-auto h-16 flex items-center justify-between">
        {/* Left: Brand Wordmark + DraftlineLogo */}
        <div className="flex items-center gap-6 lg:gap-8 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
          >
            <div className="text-neutral-950 dark:text-white transition-transform duration-200 group-hover:scale-105 shrink-0">
              <DraftlineLogo className="w-7 h-7 text-neutral-950 dark:text-white" />
            </div>
            <span className="text-lg sm:text-xl font-semibold tracking-tight whitespace-nowrap shrink-0 text-neutral-950 dark:text-white">
              Draftline
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-content-primary font-semibold"
                      : "text-content-secondary hover:text-content-primary hover:bg-surface-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Theme Toggle & Auth / User Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Streak & Coins Badge */}
              <div
                title={`Streak: ${profile?.streak_count ?? 0} days | Coins: ${
                  profile?.coins ?? 0
                }`}
                className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono bg-surface-muted border border-border-subtle text-content-primary select-none"
              >
                <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/20 text-amber-500" />
                  <span>{profile?.streak_count ?? 0}</span>
                </span>
                <span className="text-border-subtle" aria-hidden="true">
                  |
                </span>
                <span className="inline-flex items-center gap-1 text-yellow-500 font-semibold">
                  <Coins className="w-3.5 h-3.5 text-yellow-500" />
                  <span>{profile?.coins ?? 0}</span>
                </span>
              </div>

              {/* Write Button */}
              <Link
                href="/write"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-primary transition-colors active:scale-95 shadow-sm"
              >
                <PenSquare className="w-3.5 h-3.5 text-content-secondary" />
                <span>Write</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-surface-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-surface-muted border border-border-subtle flex items-center justify-center text-content-secondary">
                    {profile?.avatar_url && !avatarError ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || "User avatar"}
                        fill
                        sizes="32px"
                        className="object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-content-muted" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border-subtle bg-surface-card p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-border-subtle mb-1">
                      <p className="font-sans font-semibold text-xs text-content-primary truncate">
                        {profile?.full_name || "Writer"}
                      </p>
                      <p className="font-mono text-[11px] text-content-muted truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Streak & Coins on mobile */}
                    <div className="sm:hidden flex items-center justify-between px-3 py-2 text-xs font-mono bg-surface-muted/60 rounded-xl mb-1 text-content-primary">
                      <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                        <Flame className="w-3.5 h-3.5" />
                        <span>{profile?.streak_count ?? 0} streak</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-yellow-500 font-semibold">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{profile?.coins ?? 0} coins</span>
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-content-secondary hover:text-content-primary hover:bg-surface-muted transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </Link>

                    <Link
                      href="/write"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-content-secondary hover:text-content-primary hover:bg-surface-muted transition-colors"
                    >
                      <PenSquare className="w-3.5 h-3.5" />
                      <span>Write a Story</span>
                    </Link>

                    <div className="my-1 border-t border-border-subtle" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 bg-accent text-accent-foreground hover:opacity-90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

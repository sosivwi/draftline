"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { EditorialImage } from "@/components/editorial-image";
import {
  ArrowLeft,
  User,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Flame,
  Coins,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  PenSquare,
  BookOpen,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  X,
  FileText,
  Calendar,
  ChevronDown,
  Bookmark,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { CATEGORIES, Category, Post } from "@/lib/mock-posts";
import { getSavedPosts, toggleSavedPost } from "@/lib/saved-posts";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface UserStory {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | string[] | null;
  category: string | null;
  cover_image_url: string | null;
  read_time_minutes: number | null;
  published: boolean | null;
  created_at: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Tab state: "stories" | "saved" | "profile"
  const [activeTab, setActiveTab] = useState<"stories" | "saved" | "profile">("stories");

  // Saved Articles state
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [streakCount, setStreakCount] = useState(0);
  const [coins, setCoins] = useState(0);

  // Social links (matching public.profiles columns)
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // My Stories state
  const [myStories, setMyStories] = useState<UserStory[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [storiesError, setStoriesError] = useState<string | null>(null);

  // Edit Story Modal state
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("Travel Places");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCoverImageUrl, setEditCoverImageUrl] = useState("");
  const [editReadTime, setEditReadTime] = useState(4);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState<string | null>(null);
  const [uploadingEditCover, setUploadingEditCover] = useState(false);

  // Delete Story Confirmation Modal state
  const [deletingStory, setDeletingStory] = useState<UserStory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch stories authored by the signed-in user
  const fetchUserStories = async (userId: string) => {
    setStoriesLoading(true);
    setStoriesError(null);
    try {
      const { data, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.warn("Error fetching user stories:", postsError);
        setStoriesError("Could not load your published stories from Supabase.");
        setMyStories([]);
      } else {
        setMyStories(data || []);
      }
    } catch (err: unknown) {
      console.warn("Exception fetching user stories:", err);
      setStoriesError("An unexpected error occurred while loading your stories.");
      setMyStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  // Fetch saved articles for the user
  const fetchUserSavedPosts = async (userId?: string | null) => {
    setSavedLoading(true);
    try {
      const posts = await getSavedPosts(userId);
      setSavedPosts(posts);
    } catch (err) {
      console.warn("Could not load saved articles:", err);
      setSavedPosts([]);
    } finally {
      setSavedLoading(false);
    }
  };

  // Remove article from saved collection
  const handleRemoveSaved = async (slug: string) => {
    try {
      await toggleSavedPost(slug, user?.id);
      setSavedPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.warn("Could not remove saved post:", err);
    }
  };

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push("/login?next=/profile");
        return;
      }

      setUser(currentUser);

      // Load user metadata fallbacks
      const meta = currentUser.user_metadata || {};

      // Load profile row from public.profiles
      const { data: profile, error: profileFetchError } = await supabase
        .from("profiles")
        .select(
          "id, full_name, username, bio, avatar_url, website_url, twitter_url, instagram_url, facebook_url, streak_count, coins"
        )
        .eq("id", currentUser.id)
        .single();

      if (profileFetchError) {
        console.warn(
          "Could not fetch profile row:",
          profileFetchError.message || JSON.stringify(profileFetchError)
        );
      }

      if (profile) {
        setFullName(profile.full_name || meta.full_name || "");
        setUsername(profile.username || "");
        setBio(profile.bio || "");
        setAvatarUrl(profile.avatar_url || meta.avatar_url || "");
        setWebsiteUrl(profile.website_url || meta.website_url || "");
        setTwitterUrl(profile.twitter_url || meta.twitter_url || "");
        setInstagramUrl(profile.instagram_url || meta.instagram_url || "");
        setFacebookUrl(profile.facebook_url || meta.facebook_url || "");
        setStreakCount(profile.streak_count || 0);
        setCoins(profile.coins || 0);
      } else {
        setFullName(meta.full_name || "");
        setAvatarUrl(meta.avatar_url || "");
        setWebsiteUrl(meta.website_url || "");
        setTwitterUrl(meta.twitter_url || "");
        setInstagramUrl(meta.instagram_url || "");
        setFacebookUrl(meta.facebook_url || "");
      }

      setLoading(false);

      // Fetch user's stories & saved articles
      fetchUserStories(currentUser.id);
      fetchUserSavedPosts(currentUser.id);
    }

    loadProfile();
  }, [router, supabase]);

  // Listen for instant rewards updates dispatched across Draftline
  useEffect(() => {
    const handleRewardsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ streak?: number; coins?: number }>;
      if (customEvent.detail) {
        if (customEvent.detail.streak !== undefined) {
          setStreakCount(customEvent.detail.streak);
        }
        if (customEvent.detail.coins !== undefined) {
          setCoins(customEvent.detail.coins);
        }
      }
    };

    window.addEventListener("draftline:rewards-updated", handleRewardsUpdated);
    return () => {
      window.removeEventListener("draftline:rewards-updated", handleRewardsUpdated);
    };
  }, []);

  // Listen for saved posts updates dispatched across Draftline
  useEffect(() => {
    const handleSavedUpdated = () => {
      fetchUserSavedPosts(user?.id);
    };

    window.addEventListener("draftline:saved-posts-updated", handleSavedUpdated);
    return () => {
      window.removeEventListener("draftline:saved-posts-updated", handleSavedUpdated);
    };
  }, [user?.id]);

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    setMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
    } catch (err: unknown) {
      const uploadErrorText =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err);

      console.error("Avatar upload error:", uploadErrorText, err);
      setMessage({
        type: "error",
        text: "Could not upload avatar image to storage. You can paste an image URL below.",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    // Payload only sends valid public.profiles columns; null for empty username prevents unique constraint issues
    const updatePayload = {
      full_name: fullName.trim(),
      username: username.trim().toLowerCase() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl.trim() || null,
      website_url: websiteUrl.trim() || null,
      twitter_url: twitterUrl.trim() || null,
      instagram_url: instagramUrl.trim() || null,
      facebook_url: facebookUrl.trim() || null,
      updated_at: new Date().toISOString(),
    };

    try {
      // 1. Update public.profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      // 2. Also keep user metadata in sync
      await supabase.auth.updateUser({
        data: {
          full_name: updatePayload.full_name,
          username: updatePayload.username,
          avatar_url: updatePayload.avatar_url,
          website_url: updatePayload.website_url,
          twitter_url: updatePayload.twitter_url,
          instagram_url: updatePayload.instagram_url,
          facebook_url: updatePayload.facebook_url,
        },
      });

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err);

      console.error("Save profile error:", errorMessage, err);
      setMessage({
        type: "error",
        text: errorMessage || "Failed to save profile changes",
      });
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal with pre-populated story data
  const handleOpenEditModal = (story: UserStory) => {
    setEditingStory(story);
    setEditTitle(story.title || "");
    setEditCategory((story.category as Category) || "Travel Places");
    setEditExcerpt(story.excerpt || "");
    setEditContent(
      Array.isArray(story.content)
        ? story.content.join("\n\n")
        : story.content || ""
    );
    setEditCoverImageUrl(story.cover_image_url || "");
    setEditReadTime(story.read_time_minutes || 4);
    setEditErrorMessage(null);
  };

  // Upload cover image from inside the Edit Modal
  const handleEditCoverUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingEditCover(true);
    setEditErrorMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `covers/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(fileName);

      setEditCoverImageUrl(publicUrl);
    } catch (err: unknown) {
      console.error("Cover image upload error:", err);
      setEditErrorMessage("Could not upload image. Please try pasting a direct URL.");
    } finally {
      setUploadingEditCover(false);
    }
  };

  // Submit story edits
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory || !user) return;

    if (!editTitle.trim()) {
      setEditErrorMessage("Story title cannot be empty.");
      return;
    }

    setIsSavingEdit(true);
    setEditErrorMessage(null);

    try {
      const updatedCover =
        editCoverImageUrl.trim() ||
        editingStory.cover_image_url ||
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80";

      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title: editTitle.trim(),
          excerpt: editExcerpt.trim() || editTitle.trim(),
          content: editContent.trim(),
          category: editCategory,
          cover_image_url: updatedCover,
          read_time_minutes: editReadTime,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingStory.id)
        .eq("author_id", user.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state immediately
      setMyStories((prev) =>
        prev.map((s) =>
          s.id === editingStory.id
            ? {
                ...s,
                title: editTitle.trim(),
                excerpt: editExcerpt.trim() || editTitle.trim(),
                content: editContent.trim(),
                category: editCategory,
                cover_image_url: updatedCover,
                read_time_minutes: editReadTime,
                updated_at: new Date().toISOString(),
              }
            : s
        )
      );

      setMessage({
        type: "success",
        text: `"${editTitle.trim()}" was updated successfully.`,
      });

      // Background cache revalidation
      fetch("/api/cron/refresh-stories").catch(() => {});

      setEditingStory(null);
    } catch (err: unknown) {
      console.error("Error updating story:", err);
      setEditErrorMessage(
        err instanceof Error ? err.message : "Failed to save story changes."
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Confirm and execute story deletion
  const handleConfirmDelete = async () => {
    if (!deletingStory || !user) return;

    setIsDeleting(true);

    try {
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", deletingStory.id)
        .eq("author_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Safe optional cleanup of uploaded image in Supabase storage
      if (
        deletingStory.cover_image_url &&
        deletingStory.cover_image_url.includes("/storage/v1/object/public/media/")
      ) {
        const parts = deletingStory.cover_image_url.split(
          "/storage/v1/object/public/media/"
        );
        if (parts[1]) {
          try {
            await supabase.storage.from("media").remove([parts[1]]);
          } catch (storageErr) {
            console.warn("Storage cleanup notice:", storageErr);
          }
        }
      }

      // Remove from local list immediately
      const remainingStories = myStories.filter((s) => s.id !== deletingStory.id);
      setMyStories(remainingStories);

      // Decrement user's Story Streak by 1 (minimum 0, matching active published story count) while keeping coins intact
      const remainingPublishedCount = remainingStories.filter(
        (s) => s.published !== false
      ).length;
      const newStreak = Math.max(0, Math.min(streakCount - 1, remainingPublishedCount));

      // Update local state immediately so dashboard reflects the updated Story Streak
      setStreakCount(newStreak);

      // Persist updated Story Streak to Supabase
      try {
        await supabase
          .from("profiles")
          .update({
            streak_count: newStreak,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (profileErr) {
        console.warn("Failed to persist updated streak to Supabase on delete:", profileErr);
      }

      // Dispatch 'draftline:rewards-updated' so navbar and other components reflect the updated Story Streak immediately without page refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("draftline:rewards-updated", {
            detail: { streak: newStreak, coins },
          })
        );
      }

      setMessage({
        type: "success",
        text: `"${deletingStory.title}" was permanently deleted.`,
      });

      // Background cache purge
      fetch("/api/cron/refresh-stories").catch(() => {});

      setDeletingStory(null);
    } catch (err: unknown) {
      console.error("Delete story error:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to delete story.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-content-primary" />
        <p className="font-mono text-xs text-content-secondary">
          Loading author profile...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full text-content-primary">
      <div className="w-[90%] mx-auto pb-16">
        {/* Navigation & Header Actions */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-content-secondary hover:text-content-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to articles</span>
          </Link>

          <Link
            href="/write"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-xs font-semibold bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
          >
            <PenSquare className="w-3.5 h-3.5" />
            <span>Write a Story</span>
          </Link>
        </div>

        {/* Global Feedback Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-none text-sm flex items-center justify-between gap-3 ${
              message.type === "success"
                ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border border-red-500/20 text-red-500"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              )}
              <span>{message.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="text-xs font-mono opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Cards (Daily Streak & Coins) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-none bg-surface-card border border-border-subtle flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Flame className="w-6 h-6 fill-amber-500/20" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-500">
                Story Streak
              </p>
              <p className="font-sans font-bold text-2xl text-content-primary">
                {streakCount} {streakCount === 1 ? "Story" : "Stories"}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-none bg-surface-card border border-border-subtle flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 border border-yellow-500/20">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-500">
                Draftline Coins
              </p>
              <p className="font-sans font-bold text-2xl text-content-primary">
                {coins}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: My Stories vs Saved Articles vs Profile Settings */}
        <div className="flex items-center gap-6 mb-8 border-b border-border-subtle overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("stories")}
            className={`pb-3 text-sm font-semibold transition-colors relative border-b-2 shrink-0 ${
              activeTab === "stories"
                ? "text-content-primary border-content-primary font-bold"
                : "text-content-muted hover:text-content-secondary border-transparent"
            }`}
          >
            <span>My Stories</span>
            {!storiesLoading && (
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-none bg-neutral-200 dark:bg-neutral-800 text-content-secondary">
                {myStories.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            className={`pb-3 text-sm font-semibold transition-colors relative border-b-2 shrink-0 flex items-center gap-2 ${
              activeTab === "saved"
                ? "text-content-primary border-content-primary font-bold"
                : "text-content-muted hover:text-content-secondary border-transparent"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Articles</span>
            {!savedLoading && (
              <span className="ml-1 text-xs font-mono px-2 py-0.5 rounded-none bg-neutral-200 dark:bg-neutral-800 text-content-secondary">
                {savedPosts.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-semibold transition-colors relative border-b-2 shrink-0 ${
              activeTab === "profile"
                ? "text-content-primary border-content-primary font-bold"
                : "text-content-muted hover:text-content-secondary border-transparent"
            }`}
          >
            Profile & Social Links
          </button>
        </div>

        {/* =========================================================================
            TAB 1: MY STORIES MANAGEMENT SECTION
            ========================================================================= */}
        {activeTab === "stories" && (
          <div className="space-y-6">
            {/* Loading Skeletons */}
            {storiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={`story-skel-${idx}`}
                    className="p-5 bg-surface-card border border-border-subtle rounded-none flex flex-col sm:flex-row gap-5 animate-pulse"
                  >
                    <div className="w-full sm:w-36 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-none shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                      <div className="w-3/4 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                      <div className="w-1/2 h-3 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            ) : storiesError ? (
              <div className="p-8 rounded-none border border-red-500/20 bg-red-500/5 text-center">
                <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="font-semibold text-sm text-red-500 mb-2">
                  {storiesError}
                </p>
                <button
                  type="button"
                  onClick={() => user && fetchUserStories(user.id)}
                  className="px-4 py-2 text-xs font-semibold rounded-none bg-surface-card border border-border-subtle hover:bg-surface-muted transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : myStories.length === 0 ? (
              /* Empty State */
              <div className="p-12 sm:p-16 rounded-none border border-dashed border-neutral-300 dark:border-neutral-800 text-center bg-surface-card/40">
                <div className="w-12 h-12 mx-auto mb-4 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-border-subtle flex items-center justify-center text-content-muted">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-lg text-content-primary mb-1">
                  No stories published yet
                </h3>
                <p className="text-xs sm:text-sm text-content-secondary max-w-sm mx-auto mb-6 leading-relaxed">
                  You haven&apos;t written any stories yet. Share your perspectives
                  on travel places, design, modern culture, or mindful business.
                </p>
                <Link
                  href="/write"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                >
                  <PenSquare className="w-3.5 h-3.5" />
                  <span>Write Your First Story</span>
                </Link>
              </div>
            ) : (
              /* Stories List */
              <div className="space-y-4">
                {myStories.map((story) => {
                  const dateObj = story.created_at
                    ? new Date(story.created_at)
                    : new Date();
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={story.id}
                      className="p-5 sm:p-6 bg-surface-card border border-border-subtle hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors rounded-none flex flex-col md:flex-row md:items-center justify-between gap-5"
                    >
                      {/* Left: Thumbnail + Story Meta */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                        {/* Cover Thumbnail */}
                        <div className="relative w-full sm:w-36 h-28 sm:h-24 bg-neutral-100 dark:bg-neutral-900 rounded-none overflow-hidden shrink-0 border border-border-subtle">
                          <EditorialImage
                            src={
                              story.cover_image_url ||
                              "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
                            }
                            alt={story.title}
                            fill
                            sizes="144px"
                            className="object-cover rounded-none"
                          />
                        </div>

                        {/* Title, Category & Dates */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="rounded-none text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 select-none">
                              {story.category || "General"}
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>

                            <span className="text-content-muted text-xs">•</span>

                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-content-muted">
                              <Calendar className="w-3 h-3" />
                              {formattedDate}
                            </span>

                            <span className="text-content-muted text-xs">•</span>

                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-content-muted">
                              <Clock className="w-3 h-3" />
                              {story.read_time_minutes || 4} min read
                            </span>
                          </div>

                          <Link
                            href={`/posts/${story.slug}`}
                            className="block group"
                          >
                            <h3 className="text-base sm:text-lg font-bold text-content-primary group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-1">
                              {story.title}
                            </h3>
                          </Link>

                          {story.excerpt && (
                            <p className="text-xs sm:text-sm text-content-secondary line-clamp-1">
                              {story.excerpt}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border-subtle justify-end">
                        <Link
                          href={`/posts/${story.slug}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-content-primary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(story)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-content-primary transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingStory(story)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: SAVED ARTICLES COLLECTION SECTION
            ========================================================================= */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            {/* Loading Skeletons */}
            {savedLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={`saved-skel-${idx}`}
                    className="p-5 bg-surface-card border border-border-subtle rounded-none flex flex-col sm:flex-row gap-5 animate-pulse"
                  >
                    <div className="w-full sm:w-36 h-24 bg-neutral-200 dark:bg-neutral-800 rounded-none shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                      <div className="w-3/4 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                      <div className="w-1/2 h-3 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            ) : savedPosts.length === 0 ? (
              /* Empty State */
              <div className="p-12 sm:p-16 rounded-none border border-dashed border-neutral-300 dark:border-neutral-800 text-center bg-surface-card/40">
                <div className="w-12 h-12 mx-auto mb-4 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-border-subtle flex items-center justify-center text-content-muted">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-bold text-lg text-content-primary mb-1">
                  No saved articles yet
                </h3>
                <p className="text-xs sm:text-sm text-content-secondary max-w-sm mx-auto mb-6 leading-relaxed">
                  Bookmark stories you want to read later or revisit. Click the Save
                  button on any article to add it here.
                </p>
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore Articles</span>
                </Link>
              </div>
            ) : (
              /* Saved Articles List */
              <div className="space-y-4">
                {savedPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="p-5 sm:p-6 bg-surface-card border border-border-subtle hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors rounded-none flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    {/* Left: Thumbnail + Story Meta */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
                      {/* Cover Thumbnail */}
                      <div className="relative w-full sm:w-36 h-28 sm:h-24 bg-neutral-100 dark:bg-neutral-900 rounded-none overflow-hidden shrink-0 border border-border-subtle">
                        <EditorialImage
                          src={
                            post.coverImage ||
                            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
                          }
                          alt={post.title}
                          fill
                          sizes="144px"
                          className="object-cover rounded-none"
                        />
                      </div>

                      {/* Title, Category & Dates */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="rounded-none text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 select-none">
                            {post.category || "General"}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-content-muted">
                            <Calendar className="w-3 h-3" />
                            {post.publishedAt}
                          </span>

                          <span className="text-content-muted text-xs">•</span>

                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-content-muted">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>

                        <Link
                          href={`/posts/${post.slug}`}
                          className="block group"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-content-primary group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors line-clamp-1">
                            {post.title}
                          </h3>
                        </Link>

                        {post.excerpt && (
                          <p className="text-xs sm:text-sm text-content-secondary line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border-subtle justify-end">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-content-primary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Read</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemoveSaved(post.slug)}
                        title="Remove from saved articles"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium border border-border-subtle bg-surface-upper hover:bg-surface-muted text-content-secondary hover:text-red-500 hover:border-red-500/30 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: AUTHOR PROFILE FORM
            ========================================================================= */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
            <div className="p-6 sm:p-8 rounded-none bg-surface-card border border-border-subtle shadow-sm space-y-6">
              <div className="border-b border-border-subtle pb-6">
                <h2 className="font-sans font-bold text-2xl text-content-primary mb-1">
                  Author Profile
                </h2>
                <p className="font-sans text-xs sm:text-sm text-content-secondary">
                  Manage your public persona, avatar, and social presence on Draftline
                </p>
              </div>

              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative w-20 h-20 rounded-none overflow-hidden border border-border-strong bg-surface-muted flex items-center justify-center text-content-muted shrink-0">
                  {avatarUrl ? (
                    <EditorialImage
                      src={avatarUrl}
                      alt={fullName || "Avatar"}
                      fill
                      sizes="80px"
                      className="object-cover rounded-none"
                    />
                  ) : (
                    <User className="w-8 h-8" />
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <label className="block font-mono text-xs text-content-secondary">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-none text-xs font-semibold bg-surface-upper hover:bg-surface-muted text-content-primary border border-border-subtle transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload new image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl("")}
                        className="text-xs font-mono text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Or paste an image URL..."
                    className="w-full px-3.5 py-1.5 rounded-none text-xs bg-surface-upper border border-border-subtle text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-content-secondary mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Elena Vance"
                    required
                    className="w-full px-4 py-2 rounded-none text-xs sm:text-sm bg-surface-upper border border-border-subtle text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-content-secondary mb-1.5">
                    Username
                  </label>
                  <div className="flex items-center px-4 py-2 rounded-none text-xs sm:text-sm bg-surface-upper border border-border-subtle text-content-primary">
                    <span className="text-content-muted mr-1">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="elenavance"
                      className="w-full bg-transparent text-content-primary placeholder:text-content-muted focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-mono text-xs text-content-secondary mb-1.5">
                  Editorial Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary of your background, perspectives, and interests..."
                  className="w-full px-4 py-2.5 rounded-none text-xs sm:text-sm bg-surface-upper border border-border-subtle text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              {/* Online Presence & Links */}
              <div className="border-t border-border-subtle pt-6">
                <h3 className="text-[11px] font-medium tracking-[0.12em] uppercase text-neutral-500 mb-4">
                  Online Presence & Links
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-content-muted shrink-0" />
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-4 py-2 rounded-none text-xs sm:text-sm bg-surface-upper border border-border-subtle text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Twitter className="w-4 h-4 text-content-muted shrink-0" />
                    <input
                      type="text"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://x.com/yourhandle or @yourhandle"
                      className="w-full px-4 py-2 rounded-none text-xs sm:text-sm bg-surface-upper border border-border-subtle text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Instagram className="w-4 h-4 text-content-muted shrink-0" />
                    <input
                      type="text"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/yourhandle or @yourhandle"
                      className="w-full px-4 py-2 rounded-none text-xs sm:text-sm bg-surface-upper border border-border-subtle text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Facebook className="w-4 h-4 text-content-muted shrink-0" />
                    <input
                      type="text"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/yourhandle"
                      className="w-full px-4 py-2 rounded-none text-xs sm:text-sm bg-surface-upper border border-border-subtle text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Profile Button */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/"
                className="px-5 py-2.5 rounded-none text-xs sm:text-sm font-medium border border-border-subtle text-content-secondary hover:text-content-primary transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-none text-sm font-semibold bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            MODAL 1: EDIT STORY MODAL
            ========================================================================= */}
        {editingStory && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface-card border border-neutral-300 dark:border-neutral-800 rounded-none shadow-2xl relative my-auto overflow-hidden">
              {/* Sticky Header */}
              <div className="sticky top-0 z-10 bg-surface-card flex items-center justify-between p-6 pb-4 border-b border-border-subtle shrink-0">
                <div>
                  <h3 className="font-sans font-bold text-xl text-content-primary">
                    Edit Story
                  </h3>
                  <p className="text-xs text-content-secondary mt-0.5">
                    Update your published story. Changes reflect immediately across Draftline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingStory(null)}
                  className="p-1.5 text-content-muted hover:text-content-primary transition-colors rounded-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="overflow-y-auto p-6 sm:p-8 flex-1">
                {/* Edit Error Notification */}
                {editErrorMessage && (
                  <div className="mb-5 p-3 rounded-none bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{editErrorMessage}</span>
                  </div>
                )}

                {/* Edit Form */}
                <form id="edit-story-form" onSubmit={handleSaveEdit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                      Story Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      placeholder="Title of your story..."
                      className="w-full h-11 px-4 rounded-none bg-surface-upper border border-border-subtle text-content-primary font-bold text-base focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
                    />
                  </div>

                  {/* Balanced Category & Read Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                    <div className="w-full">
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        Category
                      </label>
                      <div className="relative w-full">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as Category)}
                          className="w-full h-11 px-4 pr-10 appearance-none rounded-none text-sm bg-surface-upper border border-border-subtle text-content-primary focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors cursor-pointer box-border"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                        Estimated Read Time (Minutes)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={editReadTime}
                        onChange={(e) => setEditReadTime(Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-none bg-surface-upper border border-border-subtle text-content-primary text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
                      />
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                      Cover Image URL
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="url"
                        value={editCoverImageUrl}
                        onChange={(e) => setEditCoverImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 h-11 px-4 rounded-none bg-surface-upper border border-border-subtle text-content-primary text-xs sm:text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors box-border"
                      />
                      <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-none text-xs font-semibold bg-surface-upper border border-border-subtle hover:bg-surface-muted text-content-primary transition-colors shrink-0 box-border">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingEditCover ? "Uploading..." : "Upload"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditCoverUpload}
                          disabled={uploadingEditCover}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Excerpt / Lead */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                      Excerpt / Standfirst
                    </label>
                    <textarea
                      rows={2}
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                      placeholder="Short 1-2 sentence lead..."
                      className="w-full p-4 rounded-none bg-surface-upper border border-border-subtle text-content-primary text-xs sm:text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors resize-none leading-relaxed box-border"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                      Story Body Content
                    </label>
                    <textarea
                      rows={6}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Write or edit the paragraphs of your story..."
                      className="w-full p-4 rounded-none bg-surface-upper border border-border-subtle text-content-primary text-xs sm:text-sm focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors resize-y leading-relaxed box-border"
                    />
                  </div>
                </form>
              </div>

              {/* Sticky Footer Action Buttons */}
              <div className="sticky bottom-0 z-10 bg-surface-card flex items-center justify-between p-6 pt-4 border-t border-border-subtle shrink-0">
                <Link
                  href={`/write?edit=${editingStory.id}`}
                  className="text-xs font-mono text-content-muted hover:text-content-primary underline"
                >
                  Open in full editor →
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingStory(null)}
                    className="px-4 py-2.5 rounded-none text-xs font-medium border border-border-subtle hover:bg-surface-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="edit-story-form"
                    disabled={isSavingEdit}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-semibold bg-neutral-900 text-neutral-100 dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSavingEdit ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 2: DELETE CONFIRMATION MODAL
            ========================================================================= */}
        {deletingStory && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface-card border border-neutral-300 dark:border-neutral-800 rounded-none shadow-2xl p-6 relative">
              <div className="flex items-start gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-none bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/20">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-content-primary">
                    Delete Story?
                  </h3>
                  <p className="text-xs text-content-secondary mt-1 leading-relaxed">
                    Are you sure you want to delete this story? This action cannot be
                    undone and the article will be permanently removed from Draftline.
                  </p>
                </div>
              </div>

              {/* Story Title Callout */}
              <div className="p-3 bg-surface-muted/60 border border-border-subtle rounded-none mb-6">
                <p className="text-xs font-bold text-content-primary line-clamp-2">
                  &ldquo;{deletingStory.title}&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-content-muted">
                  <span>{deletingStory.category || "General"}</span>
                  <span>•</span>
                  <span>{deletingStory.read_time_minutes || 4} min read</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeletingStory(null)}
                  className="px-4 py-2 rounded-none text-xs font-medium border border-border-subtle hover:bg-surface-muted transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-none text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

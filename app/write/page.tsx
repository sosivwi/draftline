"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Edit3,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { CATEGORIES, Category } from "@/lib/mock-posts";
import type { User } from "@supabase/supabase-js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [storyLoading, setStoryLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [category, setCategory] = useState<Category>("Travel Places");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auth protection check
  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        router.push(editId ? `/login?next=/write?edit=${editId}` : "/login?next=/write");
      } else {
        setUser(currentUser);
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, [router, supabase, editId]);

  // Load existing story data if in edit mode
  useEffect(() => {
    if (!user || !editId) return;

    const currentUserId = user.id;
    let isMounted = true;
    async function loadStory() {
      setStoryLoading(true);
      setErrorMessage(null);
      try {
        const { data: post, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", editId)
          .single();

        if (error || !post) {
          throw new Error(error?.message || "Story not found.");
        }

        if (post.author_id !== currentUserId) {
          throw new Error("You do not have permission to edit this story.");
        }

        if (isMounted) {
          setTitle(post.title || "");
          setSlug(post.slug || "");
          setIsCustomSlug(true);
          setCategory((post.category as Category) || "Travel Places");
          setExcerpt(post.excerpt || "");
          setContent(
            Array.isArray(post.content)
              ? post.content.join("\n\n")
              : (post.content || "")
          );
          setCoverImageUrl(post.cover_image_url || "");
          setIsEditMode(true);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load story for editing."
          );
        }
      } finally {
        if (isMounted) {
          setStoryLoading(false);
        }
      }
    }

    loadStory();
    return () => {
      isMounted = false;
    };
  }, [user, editId, supabase]);

  // Auto-generate slug from title (only if not custom and not editing an existing slug)
  useEffect(() => {
    if (!isCustomSlug && !isEditMode && title) {
      setSlug(slugify(title));
    }
  }, [title, isCustomSlug, isEditMode]);

  // Calculate read time
  const readTimeMinutes = useMemo(() => {
    const combined = `${excerpt} ${content}`;
    const words = combined.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [excerpt, content]);

  // Handle Cover Image upload to Supabase storage bucket `media`
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `covers/${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(fileName);

      setCoverImageUrl(publicUrl);
    } catch (err: unknown) {
      console.error("Storage upload error:", err);
      setErrorMessage(
        "Could not upload image to storage. You can still paste a direct image URL below."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim() || !content.trim()) {
      setErrorMessage("Please provide both a title and article body.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const finalCover =
      coverImageUrl.trim() ||
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80";

    try {
      if (isEditMode && editId) {
        const finalSlug = (slug || slugify(title)).trim();

        const { error: updateError } = await supabase
          .from("posts")
          .update({
            title: title.trim(),
            slug: finalSlug,
            excerpt: excerpt.trim() || title.trim(),
            content: content.trim(),
            category,
            cover_image_url: finalCover,
            read_time_minutes: readTimeMinutes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editId)
          .eq("author_id", user.id);

        if (updateError) {
          throw updateError;
        }

        // Trigger cache revalidation
        fetch("/api/cron/refresh-stories", { method: "GET" }).catch(() => {});

        setSuccessToast("Story updated successfully!");

        setTimeout(() => {
          router.push(`/posts/${finalSlug}`);
          router.refresh();
        }, 1200);
      } else {
        const finalSlug =
          (slug || slugify(title)) + `-${Date.now().toString(36).slice(-4)}`;

        const { error: insertError } = await supabase.from("posts").insert({
          author_id: user.id,
          title: title.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim() || title.trim(),
          content: content.trim(),
          category,
          cover_image_url: finalCover,
          read_time_minutes: readTimeMinutes,
          published: true,
        });

        if (insertError) {
          throw insertError;
        }

        // Trigger cache revalidation
        fetch("/api/cron/refresh-stories", { method: "GET" }).catch(() => {});

        setSuccessToast("Story published! +20 coins 🎉");

        setTimeout(() => {
          router.push(`/posts/${finalSlug}`);
          router.refresh();
        }, 1500);
      }
    } catch (err: unknown) {
      console.error("Error saving post:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save story."
      );
      setSubmitting(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-900 dark:text-neutral-100" />
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Checking editorial credentials...
        </p>
      </div>
    );
  }

  if (storyLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-900 dark:text-neutral-100" />
        <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
          Loading story details for editing...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-8 sm:py-12">
      <div className="w-[90%] max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-4 w-full mb-8">
          <Link
            href={isEditMode ? "/profile" : "/"}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>{isEditMode ? "Cancel & Back to My Stories" : "Cancel & Back"}</span>
          </Link>

          <div className="inline-flex items-center gap-2 shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-none text-xs font-mono bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800">
            {isEditMode ? (
              <>
                <Edit3 className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
                <span>Editing Published Story</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100 shrink-0" />
                <span>Earn +20 coins per publish</span>
              </>
            )}
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 p-4 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-none bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Title Input */}
          <div>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your story..."
              required
              className="w-full bg-transparent font-sans font-extrabold text-3xl sm:text-5xl tracking-tight text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none resize-none leading-tight border-b border-transparent focus:border-neutral-300 dark:focus:border-neutral-700 transition-colors pb-2"
            />
          </div>

          {/* Metadata Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-none bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            {/* Category Selector */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2.5 rounded-none text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Read Time (Calculated) */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
                Estimated Read Time
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-none text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span className="font-mono text-xs">{readTimeMinutes} min read</span>
              </div>
            </div>

            {/* URL Slug */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomSlug(!isCustomSlug)}
                  className="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline transition-colors"
                >
                  {isCustomSlug ? "Auto-generate" : "Customize"}
                </button>
              </div>
              <div className="flex items-center px-3.5 py-2 rounded-none text-xs sm:text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
                <span className="text-neutral-400 font-mono select-none mr-1">
                  draftline.dev/posts/
                </span>
                <input
                  type="text"
                  value={slug}
                  disabled={!isCustomSlug}
                  onChange={(e) => {
                    setIsCustomSlug(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="article-slug"
                  className="flex-1 bg-transparent border-none focus:outline-none font-mono text-neutral-900 dark:text-white disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Upload Area */}
          <div className="p-5 rounded-none bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Cover Image (Supabase Media Bucket)
            </label>

            {coverImageUrl ? (
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-none overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 group">
                <Image
                  src={coverImageUrl}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl("")}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-none text-xs font-mono bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-none p-8 hover:border-neutral-900 dark:hover:border-neutral-300 transition-colors bg-white dark:bg-neutral-950">
                {uploadingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-900 dark:text-white" />
                    <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                      Uploading to Supabase media bucket...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-none bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-500 mb-3 border border-neutral-200 dark:border-neutral-800">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-sans text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      Upload high-res cover photo
                    </p>
                    <p className="font-mono text-xs text-neutral-400 mb-4 text-center">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-none text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 transition-opacity">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            )}

            {/* Direct Image URL input as fallback */}
            <div>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Or paste an image URL (e.g. Unsplash or Supabase URL)..."
                className="w-full px-4 py-2.5 rounded-none text-xs sm:text-sm bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Excerpt Lead */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
              Excerpt Lead (Short summary shown on cards)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A compelling 1-2 sentence preview for your story..."
              className="w-full px-4 py-3 rounded-none text-sm sm:text-base bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-white leading-relaxed transition-colors"
            />
          </div>

          {/* Full Article Content */}
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
              Story Body (Separate paragraphs with blank lines)
            </label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here... Separate paragraphs with an empty line."
              required
              className="w-full px-5 py-4 rounded-none text-base leading-relaxed bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              href={isEditMode ? "/profile" : "/"}
              className="px-5 py-2.5 rounded-none text-xs sm:text-sm font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-900 dark:hover:border-white transition-colors"
            >
              Discard
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-none text-sm font-semibold bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditMode ? "Saving Changes..." : "Publishing & Crediting Coins..."}</span>
                </>
              ) : isEditMode ? (
                <>
                  <span>Save & Update Story</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Publish Story</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-900 dark:text-neutral-100" />
          <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            Loading editor...
          </p>
        </div>
      }
    >
      <WriteForm />
    </Suspense>
  );
}

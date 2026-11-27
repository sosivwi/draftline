import { createClient } from "@/utils/supabase/client";
import { Post } from "@/lib/mock-posts";
import { getLivePosts } from "@/lib/supabase-posts";

// Deprecated: localStorage fallback completely removed per sign-in requirement
export function getLocalSavedSlugs(): string[] {
  return [];
}

export function setLocalSavedSlugs(_slugs: string[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("draftline_saved_posts");
    } catch {}
  }
}

/**
 * Check if an article is saved.
 * Only signed-in users can have saved articles (no localStorage fallback).
 */
export async function isPostSaved(slug: string, userId?: string | null): Promise<boolean> {
  if (!userId) {
    return false;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("saved_posts")
      .select("id")
      .eq("user_id", userId)
      .eq("post_slug", slug)
      .maybeSingle();

    return !error && !!data;
  } catch (err) {
    console.warn("Error checking saved_posts in Supabase:", err);
    return false;
  }
}

/**
 * Toggle save status for an article.
 * Only authenticated users can save/unsave stories, persisted via Supabase saved_posts table.
 */
export async function toggleSavedPost(
  slug: string,
  userId?: string | null
): Promise<boolean> {
  if (!userId) {
    return false;
  }

  try {
    const supabase = createClient();
    // Check if already saved in Supabase
    const { data: existing } = await supabase
      .from("saved_posts")
      .select("id")
      .eq("user_id", userId)
      .eq("post_slug", slug)
      .maybeSingle();

    const nextSaved = !existing;

    if (nextSaved) {
      await supabase.from("saved_posts").upsert(
        {
          user_id: userId,
          post_slug: slug,
          created_at: new Date().toISOString(),
        },
        { onConflict: "user_id,post_slug" }
      );
    } else {
      await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", userId)
        .eq("post_slug", slug);
    }

    // Dispatch event for cross-component zero-refresh sync
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("draftline:saved-posts-updated", {
          detail: { slug, isSaved: nextSaved },
        })
      );
    }

    return nextSaved;
  } catch (err) {
    console.warn("Could not sync saved post with Supabase:", err);
    return false;
  }
}

/**
 * Retrieve saved articles for a signed-in user directly from Supabase saved_posts.
 */
export async function getSavedPosts(userId?: string | null): Promise<Post[]> {
  if (!userId) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("saved_posts")
      .select("post_slug")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    const slugs = data.map((row: { post_slug: string }) => row.post_slug);
    const allPosts = await getLivePosts();
    const postMap = new Map(allPosts.map((p) => [p.slug, p]));
    const ordered: Post[] = [];
    for (const slug of slugs) {
      const p = postMap.get(slug);
      if (p) ordered.push(p);
    }
    return ordered;
  } catch (err) {
    console.warn("Could not fetch remote saved_posts:", err);
    return [];
  }
}

import { createClient } from "@/utils/supabase/client";
import { Post } from "@/lib/mock-posts";
import { getLivePosts } from "@/lib/supabase-posts";

const STORAGE_KEY = "draftline_saved_posts";

export function getLocalSavedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Could not read local saved posts:", err);
    return [];
  }
}

export function setLocalSavedSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch (err) {
    console.warn("Could not write local saved posts:", err);
  }
}

export async function isPostSaved(slug: string, userId?: string | null): Promise<boolean> {
  const localSlugs = getLocalSavedSlugs();
  const locallySaved = localSlugs.includes(slug);

  if (!userId) {
    return locallySaved;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("saved_posts")
      .select("id")
      .eq("user_id", userId)
      .eq("post_slug", slug)
      .maybeSingle();

    if (!error && data) {
      // Sync to local storage if missing
      if (!locallySaved) {
        setLocalSavedSlugs([...localSlugs, slug]);
      }
      return true;
    }
  } catch (err) {
    console.warn("Error checking saved_posts in Supabase:", err);
  }

  return locallySaved;
}

export async function toggleSavedPost(
  slug: string,
  userId?: string | null
): Promise<boolean> {
  const localSlugs = getLocalSavedSlugs();
  const currentlySaved = localSlugs.includes(slug);
  const nextSaved = !currentlySaved;

  // 1. Immediately update localStorage for instant optimistic UI on all devices
  let updatedLocal: string[];
  if (nextSaved) {
    updatedLocal = Array.from(new Set([slug, ...localSlugs]));
  } else {
    updatedLocal = localSlugs.filter((s) => s !== slug);
  }
  setLocalSavedSlugs(updatedLocal);

  // 2. Dispatch custom event for cross-component zero-refresh sync
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("draftline:saved-posts-updated", {
        detail: { slug, isSaved: nextSaved, allSlugs: updatedLocal },
      })
    );
  }

  // 3. If signed in, synchronize with Supabase saved_posts table
  if (userId) {
    try {
      const supabase = createClient();
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
    } catch (err) {
      console.warn("Could not sync saved post with Supabase:", err);
    }
  }

  return nextSaved;
}

export async function getSavedPosts(userId?: string | null): Promise<Post[]> {
  const localSlugs = getLocalSavedSlugs();
  let remoteSlugs: string[] = [];

  if (userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("saved_posts")
        .select("post_slug")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        remoteSlugs = data.map((row: { post_slug: string }) => row.post_slug);
      }
    } catch (err) {
      console.warn("Could not fetch remote saved_posts:", err);
    }
  }

  // Combine unique slugs from remote and local, preserving most recently saved first
  const allSavedSlugs = Array.from(new Set([...remoteSlugs, ...localSlugs]));
  if (allSavedSlugs.length === 0) return [];

  const allPosts = await getLivePosts();
  const postMap = new Map(allPosts.map((p) => [p.slug, p]));
  const ordered: Post[] = [];
  for (const slug of allSavedSlugs) {
    const p = postMap.get(slug);
    if (p) ordered.push(p);
  }
  return ordered;
}

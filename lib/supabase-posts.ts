import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { MOCK_POSTS, Post, Category } from "@/lib/mock-posts";

function getPublicSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

export interface SupabaseProfileRow {
  id?: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  streak_count?: number | null;
  coins?: number | null;
}

export interface SupabasePostRow {
  id: string;
  author_id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | string[] | null;
  category?: string | null;
  cover_image_url?: string | null;
  read_time_minutes?: number | null;
  published?: boolean | null;
  created_at?: string;
  updated_at?: string;
  profiles?: SupabaseProfileRow | SupabaseProfileRow[] | null;
}

export function formatSupabasePost(row: SupabasePostRow): Post {
  let contentParagraphs: string[] = [];
  if (Array.isArray(row.content)) {
    contentParagraphs = row.content;
  } else if (typeof row.content === "string") {
    contentParagraphs = row.content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  if (contentParagraphs.length === 0) {
    contentParagraphs = [row.excerpt || "No content provided."];
  }

  const dateObj = row.created_at ? new Date(row.created_at) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: contentParagraphs,
    category: (row.category as Category) || "Lifestyle & Modern Living",
    coverImage:
      row.cover_image_url ||
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    publishedAt: formattedDate,
    readTime: `${row.read_time_minutes || 4} min read`,
    author: {
      name: profile?.full_name || "Draftline Editor",
      role: profile?.username ? `@${profile.username}` : "Staff Contributor",
      avatar:
        profile?.avatar_url ||
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    },
    featured: false,
  };
}

export async function getLivePosts(): Promise<Post[]> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(*)")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_POSTS;
    }

    const livePosts = data.map(formatSupabasePost);
    if (livePosts.length > 0) {
      livePosts[0].featured = true;
    }
    return livePosts;
  } catch (err) {
    console.error("Error fetching live posts from Supabase:", err);
    return MOCK_POSTS;
  }
}

export async function getLivePostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = getPublicSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(*)")
      .eq("slug", slug)
      .single();

    if (data && !error) {
      return formatSupabasePost(data);
    }
  } catch (err) {
    console.error(`Error fetching post by slug ${slug}:`, err);
  }

  // Graceful fallback to mock posts
  const mock = MOCK_POSTS.find((p) => p.slug === slug);
  return mock ?? null;
}

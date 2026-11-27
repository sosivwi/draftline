import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  MOCK_POSTS,
  Post,
  Category,
  isCategoryMatch,
} from "@/lib/mock-posts";
import {
  getInMemoryDailyPosts,
  getInMemoryDailyPostBySlug,
} from "@/lib/daily-stories";

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
  published_at?: string;
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

  const rawDate = row.published_at || row.created_at;
  const dateObj = rawDate ? new Date(rawDate) : new Date();
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
    // Strict newest-first query: order by published_at descending, falling back to created_at descending
    let data: SupabasePostRow[] | null = null;
    const initialRes = await supabase
      .from("posts")
      .select("*, profiles(*)")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (initialRes.error) {
      // Fallback to created_at descending if published_at column does not exist
      const fallbackRes = await supabase
        .from("posts")
        .select("*, profiles(*)")
        .eq("published", true)
        .order("created_at", { ascending: false });
      data = fallbackRes.data as SupabasePostRow[] | null;
    } else {
      data = initialRes.data as SupabasePostRow[] | null;
    }

    const livePosts = data ? data.map(formatSupabasePost) : [];

    // Fresh in-memory daily stories (generated today)
    const inMemoryDaily = getInMemoryDailyPosts();
    const existingSlugs = new Set(livePosts.map((p) => p.slug.toLowerCase()));
    const existingIds = new Set(livePosts.map((p) => p.id));

    // Prepend any in-memory daily posts not already in Supabase
    const uniqueDaily = inMemoryDaily.filter(
      (d) => !existingSlugs.has(d.slug.toLowerCase()) && !existingIds.has(d.id)
    );
    uniqueDaily.forEach((d) => {
      existingSlugs.add(d.slug.toLowerCase());
      existingIds.add(d.id);
    });

    const activeLivePosts = [...uniqueDaily, ...livePosts];

    // Combine fresh live stories (strictly at the top) with non-colliding editorial archive at the bottom
    const supplementalMocks = MOCK_POSTS.filter(
      (m) => !existingSlugs.has(m.slug.toLowerCase()) && !existingIds.has(m.id)
    );
    const combinedPosts = [...activeLivePosts, ...supplementalMocks];

    if (combinedPosts.length > 0) {
      // Pin the newest story at the very top of the stack as the featured hero
      combinedPosts.forEach((p, idx) => {
        p.featured = idx === 0;
      });
    }
    return combinedPosts;
  } catch (err) {
    console.error("Error fetching live posts from Supabase:", err);
    const inMemory = getInMemoryDailyPosts();
    const existingSlugs = new Set(inMemory.map((p) => p.slug.toLowerCase()));
    const fallback = [
      ...inMemory,
      ...MOCK_POSTS.filter((m) => !existingSlugs.has(m.slug.toLowerCase())),
    ];
    if (fallback.length > 0) {
      fallback.forEach((p, idx) => {
        p.featured = idx === 0;
      });
    }
    return fallback;
  }
}

export async function getLivePostsByCategory(categorySlug: string): Promise<Post[]> {
  const posts = await getLivePosts();
  return posts.filter((p) => isCategoryMatch(p.category, categorySlug));
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

  // Check in-memory daily posts
  const dailyMatch = getInMemoryDailyPostBySlug(slug);
  if (dailyMatch) return dailyMatch;

  // Graceful fallback to mock posts
  const mock = MOCK_POSTS.find((p) => p.slug === slug);
  return mock ?? null;
}

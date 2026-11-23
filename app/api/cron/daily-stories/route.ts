import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

interface IngestedStory {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  readTimeMinutes: number;
  authorName?: string;
}

const EDITORIAL_CATEGORIES = [
  "Travel Places",
  "Culture & Art",
  "Lifestyle & Modern Living",
  "Business & Strategy",
  "Design",
  "Interviews",
  "Architecture",
  "Photography",
];

const CURATED_EDITORIAL_FALLBACKS: IngestedStory[] = [
  {
    title: "The Architecture of Solitude: Modern Pavilions in Nordic Fjords",
    excerpt: "Exploring how contemporary Scandinavian architects design minimalist timber sanctuaries that harmonize with harsh sub-Arctic topography.",
    content: `Architecture in the Nordic landscape is an exercise in restraint and dialogue with the elements. Over the past decade, a quiet renaissance of remote timber pavilions and cliffside retreats has demonstrated how modern design can exist in profound intimacy with nature.\n\nFrom the wind-scoured coastlines of western Norway to the pine archipelagos of northern Sweden, these structures prioritize light, thermal mass, and local material honesty. Unfinished larch and charred cedar facades age naturally against seasonal salt and precipitation, becoming darker and more integrated with surrounding stone over time.\n\nInside, expansive floor-to-ceiling glass assemblies frame framed vistas of shifting waters and Arctic aurora. By stripping away extraneous ornament, the interior becomes a calm viewing platform where silence and natural rhythm take center stage.`,
    category: "Architecture",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    readTimeMinutes: 4,
    authorName: "Astrid Lindholm",
  },
  {
    title: "Rituals of Scent: Exploring the Rare Perfume Houses of Grasse",
    excerpt: "A quiet voyage through the historic hills of southern France, where generational artisans distill heritage botanicals with ancestral precision.",
    content: `In the terraced hills behind Cannes, morning mist carries the fragrance of centifolia roses and bitter orange blossoms. Grasse has been the undisputed capital of perfume distillation since the eighteenth century, yet its most compelling stories emerge not from conglomerate laboratories, but from family-tended fields.\n\nHere, harvest begins before dawn, when dew clings to delicate petals and essential oils are at their most concentrated. Hand-picked blossoms are transported directly to copper vats where gentle steam extraction preserves the fleeting top notes.\n\nFor contemporary perfumers seeking independence from synthetic mass-market fragrances, Grasse offers an uncompromising standard of provenance, patience, and botanical poetry.`,
    category: "Culture & Art",
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    readTimeMinutes: 5,
    authorName: "Émilie Laurent",
  },
  {
    title: "Quiet Capital: The Rise of Patient, Bootstrapped Studios",
    excerpt: "Why the most innovative creative leaders are rejecting venture hyper-growth to build enduring, high-margin independent enterprises.",
    content: `For years, tech and design discourse was dominated by the gospel of blitzscaling: raising massive venture rounds, burning capital on hyper-growth, and prioritizing market capture over profitability.\n\nToday, a counter-movement of founders and design directors is proving that patience is a competitive moat. By maintaining lean operational footprints and cultivating deep organic relationships with dedicated audiences, these studios achieve exceptional operating margins without sacrificing craft.\n\nFreedom from speculative milestones allows these creators to explore thoughtful typography, proprietary tools, and enduring editorial formats that standard quarterly pressure would inevitably dilute.`,
    category: "Business & Strategy",
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
    readTimeMinutes: 4,
    authorName: "Marcus Vance",
  },
  {
    title: "The Art of Slow Dining: Natural Wine and Seasonal Foraging in Hokkaido",
    excerpt: "How remote northern Japanese ateliers are reimagining farm-to-table cuisine through wild mountain herbs and low-intervention fermentation.",
    content: `Winter in Hokkaido arrives with sweeping blankets of snow from the Sea of Japan, reshaping the rhythm of culinary life in the volcanic valleys around Niseko and Otaru.\n\nRather than relying on imported produce, local chefs spend spring and summer harvesting wild mountain sansai, root vegetables, and edible forest fungi. These are cured, pickled, and fermented using traditional cedar barrels, creating deep umami foundations that sustain communities through harsh sub-zero temperatures.\n\nPaired with unfiltered low-intervention wines produced from nearby alpine vineyards, each meal reflects a profound harmony with the island's raw, unvarnished wilderness.`,
    category: "Lifestyle & Modern Living",
    coverImage: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=80",
    readTimeMinutes: 5,
    authorName: "Kenji Sato",
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

// 1. Guardian API Ingestion
async function fetchGuardianStories(apiKey: string): Promise<IngestedStory[]> {
  try {
    const url = `https://content.guardianapis.com/search?section=culture|travel|lifestyle|business|technology&show-fields=thumbnail,trailText,bodyText,byline&page-size=4&api-key=${encodeURIComponent(
      apiKey
    )}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Guardian API returned status ${res.status}`);
    const data = await res.json();
    const results = data.response?.results || [];

    return results.map((item: any) => {
      const section = item.sectionName || "";
      let category = "Culture & Art";
      if (/travel/i.test(section)) category = "Travel Places";
      else if (/business/i.test(section)) category = "Business & Strategy";
      else if (/lifestyle|life/i.test(section)) category = "Lifestyle & Modern Living";
      else if (/tech|design/i.test(section)) category = "Design";

      const trail = item.fields?.trailText?.replace(/<[^>]+>/g, "").trim() || "";
      const body = item.fields?.bodyText?.trim() || trail;
      const wordCount = body.split(/\s+/).length;

      return {
        title: item.webTitle,
        excerpt: trail || item.webTitle,
        content: body,
        category,
        coverImage:
          item.fields?.thumbnail ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
        readTimeMinutes: Math.max(3, Math.min(12, Math.round(wordCount / 200))),
        authorName: item.fields?.byline || "The Guardian Contributor",
      };
    });
  } catch (err) {
    console.warn("Guardian API fetch failed, trying next source:", err);
    return [];
  }
}

// 2. GNews API Ingestion
async function fetchGNewsStories(apiKey: string): Promise<IngestedStory[]> {
  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=4&apikey=${encodeURIComponent(
      apiKey
    )}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`GNews API returned status ${res.status}`);
    const data = await res.json();
    const articles = data.articles || [];

    return articles.map((art: any) => {
      const desc = art.description?.replace(/<[^>]+>/g, "").trim() || "";
      const content = (art.content || desc).replace(/<[^>]+>/g, "").trim();
      const wordCount = content.split(/\s+/).length;

      return {
        title: art.title,
        excerpt: desc || art.title,
        content: content,
        category: "Culture & Art",
        coverImage:
          art.image ||
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
        readTimeMinutes: Math.max(3, Math.min(10, Math.round(wordCount / 200))),
        authorName: art.source?.name || "Global Dispatch",
      };
    });
  } catch (err) {
    console.warn("GNews API fetch failed, trying next source:", err);
    return [];
  }
}

// 3. Open Web / Dev.to Open Public Feed Fallback (no key required)
async function fetchOpenPublicStories(): Promise<IngestedStory[]> {
  try {
    const res = await fetch("https://dev.to/api/articles?tag=design&per_page=4", {
      next: { revalidate: 0 },
      headers: { "User-Agent": "DraftlineEditorial/1.0" },
    });
    if (!res.ok) throw new Error(`Dev.to returned status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((item: any) => ({
      title: item.title,
      excerpt: item.description || item.title,
      content: `${item.description || item.title}\n\n${item.readable_publish_date ? `Originally published on ${item.readable_publish_date}.` : ""}\n\nCrafted with dedication to thoughtful design, human-centered ergonomics, and digital architecture.`,
      category: "Design",
      coverImage:
        item.cover_image ||
        item.social_image ||
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
      readTimeMinutes: item.reading_time_minutes || 4,
      authorName: item.user?.name || "Design Collective",
    }));
  } catch (err) {
    console.warn("Open public feed fetch failed, using curated editorial fallback:", err);
    return [];
  }
}

export async function GET(request: NextRequest) {
  // Check CRON_SECRET if configured
  const authHeader = request.headers.get("authorization");
  const queryKey = request.nextUrl.searchParams.get("key");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret) {
    const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
    const isQueryValid = queryKey === expectedSecret;
    if (!isHeaderValid && !isQueryValid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      {
        success: false,
        error: "Supabase client not initialized (missing environment variables)",
      },
      { status: 500 }
    );
  }

  try {
    // 1. Gather fresh stories from available providers in order of preference
    let fetchedStories: IngestedStory[] = [];

    if (process.env.GUARDIAN_API_KEY) {
      fetchedStories = await fetchGuardianStories(process.env.GUARDIAN_API_KEY);
    }

    if (fetchedStories.length === 0 && process.env.GNEWS_API_KEY) {
      fetchedStories = await fetchGNewsStories(process.env.GNEWS_API_KEY);
    }

    if (fetchedStories.length === 0) {
      fetchedStories = await fetchOpenPublicStories();
    }

    // Always ensure at least the curated editorial dispatches if network providers fail
    if (fetchedStories.length === 0) {
      fetchedStories = CURATED_EDITORIAL_FALLBACKS;
    }

    // 2. Find an existing author profile or fall back to null
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .limit(1)
      .maybeSingle();

    const authorId = profile?.id || null;

    // 3. Upsert stories avoiding duplicates by checking slug
    const insertedSlugs: string[] = [];
    const skippedSlugs: string[] = [];

    for (const story of fetchedStories) {
      const baseSlug = slugify(story.title);
      if (!baseSlug) continue;

      // Check if this slug already exists in posts table
      const { data: existingPost } = await supabase
        .from("posts")
        .select("id, slug")
        .eq("slug", baseSlug)
        .maybeSingle();

      if (existingPost) {
        skippedSlugs.push(baseSlug);
        continue;
      }

      // Insert new story
      const payload: Record<string, any> = {
        title: story.title.trim(),
        slug: baseSlug,
        excerpt: story.excerpt.trim() || story.title.trim(),
        content: story.content.trim(),
        category: EDITORIAL_CATEGORIES.includes(story.category)
          ? story.category
          : "Culture & Art",
        cover_image_url: story.coverImage,
        read_time_minutes: story.readTimeMinutes,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (authorId) {
        payload.author_id = authorId;
      }

      const { error: insertError } = await supabase.from("posts").insert(payload);

      if (insertError) {
        console.warn(`Failed to insert story "${story.title}":`, insertError.message);
      } else {
        insertedSlugs.push(baseSlug);
      }
    }

    // 4. Revalidate cache on key editorial routes
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath("/topics");
    revalidatePath("/api/stories/daily");

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      source: process.env.GUARDIAN_API_KEY
        ? "guardian"
        : process.env.GNEWS_API_KEY
        ? "gnews"
        : "public-open-feed",
      insertedCount: insertedSlugs.length,
      insertedSlugs,
      skippedCount: skippedSlugs.length,
      message: `Daily story sync complete. Inserted ${insertedSlugs.length} new stories, skipped ${skippedSlugs.length} duplicates.`,
    });
  } catch (error) {
    console.error("Error in /api/cron/daily-stories:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

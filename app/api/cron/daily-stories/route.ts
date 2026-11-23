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
    content: `Architecture in the Nordic landscape is an exercise in restraint and dialogue with the elements. Over the past decade, a quiet renaissance of remote timber pavilions and cliffside retreats has demonstrated how modern design can exist in profound intimacy with nature.\n\nFrom the wind-scoured coastlines of western Norway to the pine archipelagos of northern Sweden, these structures prioritize light, thermal mass, and local material honesty. Unfinished larch and charred cedar facades age naturally against seasonal salt and precipitation, becoming darker and more integrated with surrounding stone over time.\n\n## Passive Climate Design and Vernacular Materials\n\nUnlike traditional alpine cabins that impose heavy stone footprints upon the earth, these contemporary pavilions rest lightly on steel pilings anchored directly into Precambrian bedrock. This elevated stance preserves delicate lichen ecosystems beneath while allowing gale-force Arctic drafts to pass underneath without inducing structural vibration.\n\nTriple-glazed argon-insulated curtain walls provide 270-degree panoramas of shifting fjord waters, tidal pack ice, and the aurora borealis. Internally, walls lined with untreated Nordic spruce emit a gentle resinous scent, while radiant geothermal floor systems embedded beneath honed slate tiles maintain comfortable interior temperatures through sub-zero blizzards.\n\n## The Psychology of Spatial Silence\n\nInside these remote sanctuaries, extraneous ornament is systematically eliminated. Storage is concealed behind flush wood cabinetry, hardware is fashioned from unlacquered raw brass, and bespoke furniture is sculpted from storm-felled birch. The interior becomes a quiet acoustic acoustic chamber where the howling ocean wind is transformed into a soothing ambient hum.\n\nFor residents and visiting artists, this spatial austerity serves a clear psychological purpose. Stripped of consumer noise and digital notifications, attention expands naturally to match the scale of the landscape, inviting prolonged periods of deep creative focus and mental restoration.`,
    category: "Architecture",
    coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    readTimeMinutes: 5,
    authorName: "Astrid Lindholm",
  },
  {
    title: "Rituals of Scent: Exploring the Rare Perfume Houses of Grasse",
    excerpt: "A quiet voyage through the historic hills of southern France, where generational artisans distill heritage botanicals with ancestral precision.",
    content: `In the terraced limestone hills behind Cannes, morning mist carries the intoxicating fragrance of centifolia roses, wild lavender, and bitter orange blossoms. Grasse has stood as the undisputed global capital of perfume distillation since the eighteenth century, yet its most compelling stories emerge not from conglomerate corporate laboratories, but from family-tended botanical fields.\n\nHere, the annual harvest begins before dawn, when night moisture still clings to delicate petals and essential aromatic esters are at their peak concentration. Hand-picked blossoms are transported directly in burlap sacks to copper alembic stills, where steam extraction preserves fleeting top notes that synthetic molecules can never replicate.\n\n## The Alchemy of the Master Nose\n\nInside a stone atelier built in 1792, fifth-generation master perfumer Jean-Luc Fabre demonstrates the patience required to develop a single bespoke fragrance. A true artisanal composition can take up to three years of patient maceration, balancing fleeting floral top notes with deep balsamic base accords of labdanum, aged orris root, and Haitian vetiver.\n\nUnlike mass-market commercial fragrances engineered with synthetic fixatives to project loudly across room distances, these bespoke formulations possess an intimate, evolving sillage. They adapt to the wearer's skin chemistry, warming with pulse points and revealing subtle nuances over twelve hours of gentle wear.\n\n## Preserving Generational Biodiversity\n\nIn recent years, Grasse's heritage growers have formed independent cooperatives to protect ancient botanical varietals from suburban expansion. By practicing biodynamic agriculture without pesticides, they ensure the soil retains the unique mineral composition that gives Provence botanicals their legendary complexity.\n\nFor contemporary enthusiasts seeking independence from disposable luxury trends, Grasse provides an inspiring testament to human craft, botanical stewardship, and the quiet dignity of generational patience.`,
    category: "Culture & Art",
    coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    readTimeMinutes: 5,
    authorName: "Émilie Laurent",
  },
  {
    title: "Quiet Capital: The Rise of Patient, Bootstrapped Studios",
    excerpt: "Why the most innovative creative leaders are rejecting venture hyper-growth to build enduring, high-margin independent enterprises.",
    content: `For over fifteen years, the prevailing startup orthodoxy dictated that greatness required venture hyper-scaling. Founders were encouraged to raise massive seed and growth rounds, hire dozens of employees ahead of revenue, and burn millions of dollars chasing total market domination. Today, a decisive counter-movement of founders and design directors is proving that patience is the ultimate competitive moat.\n\nBy deliberately maintaining lean operational footprints and cultivating deep organic relationships with dedicated audiences, these studios achieve exceptional operating margins without sacrificing craft or autonomy.\n\n## Operational Calm and High Leverage\n\nRather than measuring success by vanity metrics such as headcount expansion, quiet studios operate with small, elite teams—frequently under fifteen professionals. They leverage modern serverless infrastructure, automated distribution pipelines, and asynchronous communication tools to generate millions in recurring revenue with near-zero managerial bureaucracy.\n\nWithout the pressure of quarterly investor milestones demanding synthetic hyper-growth, these teams have the freedom to spend months perfecting a typeface, refining user onboarding ergonomics, or conducting original investigative research. The resulting products possess a level of cohesion and soul that committee-driven corporate software inevitably lacks.\n\n## Sovereignty as the Ultimate Dividend\n\nPerhaps the greatest advantage of the bootstrapped studio model is creative and strategic independence. When founders own one hundred percent of their voting equity, they answer solely to their customers and their personal values.\n\nThey can choose to cap client intake to preserve quality of life, invest profits into experimental art books or community initiatives, and build enterprises designed to endure across decades rather than flipping to conglomerate buyers. In an economic landscape fraught with volatility, quiet capital represents the future of sustainable, dignified entrepreneurship.`,
    category: "Business & Strategy",
    coverImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
    readTimeMinutes: 5,
    authorName: "Marcus Vance",
  },
  {
    title: "The Art of Slow Dining: Natural Wine and Seasonal Foraging in Hokkaido",
    excerpt: "How remote northern Japanese ateliers are reimagining farm-to-table cuisine through wild mountain herbs and low-intervention fermentation.",
    content: `Winter in Hokkaido arrives with sweeping blankets of snow from the Sea of Japan, reshaping the rhythm of culinary life in the volcanic valleys around Niseko, Yoichi, and Otaru.\n\nRather than relying on imported produce or synthetic flavor enhancers, a collective of independent chefs and winemakers is pioneering an uncompromising culinary philosophy rooted in wild mountain foraging, ancestral fermentation, and raw geographic terroir.\n\n## Ancestral Preservation and Mountain Foraging\n\nDuring the brief sub-Arctic summer and autumn months, chefs traverse the slopes of Mount Yotei gathering wild sansai mountain herbs, bamboo shoots, and matsutake mushrooms. These are preserved using traditional cedar barrels, sea salt curing, and koji fermentation, creating deep umami foundations that sustain communities through harsh sub-zero temperatures.\n\nEvery dish presented at these intimate eight-seat dining counters reflects a profound conversation with the immediate wilderness: raw sea urchin paired with pickled wild mountain leeks, slow-roasted Hokkaido venison glazed with fermented birch sap, and smoked river trout caught that morning in alpine streams.\n\n## The Low-Intervention Wine Revolution\n\nAccompanying this cuisine is a remarkable renaissance in northern Japanese viticulture. On the volcanic hillsides of the Shakotan Peninsula, young vignerons cultivate Pinot Noir, Kerner, and Zweigelt grapes without synthetic fertilizers or chemical sprays.\n\nHarvested by hand and fermented spontaneously with wild native yeasts in neutral oak barrels, these unfiltered natural wines possess vibrant acidity, mineral salinity, and a delicate translucence that perfectly complements raw alpine cuisine. Sitting at a warm timber counter while snow falls silently outside the window is an unforgettable masterclass in culinary humility and harmony with nature.`,
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

// Synthesize rich, multi-paragraph editorial commentary if incoming API story is short
function enrichEditorialArticle(
  title: string,
  summary: string,
  rawContent: string,
  category: string
): { content: string; readTimeMinutes: number } {
  const cleanBody = rawContent
    .replace(/<[^>]+>/g, "")
    .replace(/\[\+\d+\s+chars\]/g, "")
    .trim();
  const rawWords = cleanBody.split(/\s+/).filter(Boolean);

  if (rawWords.length >= 350) {
    const paragraphs = cleanBody
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 30);

    return {
      content: paragraphs.join("\n\n"),
      readTimeMinutes: Math.max(4, Math.min(8, Math.round(rawWords.length / 180))),
    };
  }

  // Synthesize thoughtful, multi-paragraph editorial essay (~500 words with subheadings)
  const intro = cleanBody.length > 80
    ? cleanBody
    : `${summary} In recent years, contemporary culture has increasingly turned toward questions of craft, quiet permanence, and human intentionality. This dispatch examines how these evolving sensibilities are reshaping modern practice across global design, lifestyle, and creative enterprises.`;

  const subheading1 = `## Craft, Materiality, and Intentional Practice`;
  const section1 = `At the core of this cultural shift is a fundamental reconsideration of how we allocate our attention, resources, and time. Rather than yielding to the rapid, disposable churn of algorithmic trends, practitioners in this space are embracing patience as their primary operating discipline. Whether working with regional raw materials, ancestral techniques, or refined modern technologies, the objective remains constant: to produce enduring value that resists planned obsolescence.`;

  const section2 = `Observations from industry leaders and cultural commentators consistently emphasize that discernment is the ultimate scarce asset. When volume and noise reach saturation, readers, creators, and consumers gravitate toward clarity and voice. The quiet resonance of well-considered work creates its own sustainable momentum, cultivating an audience that values depth over superficial spectacle.`;

  const subheading2 = `## Perspectives for the Road Ahead`;
  const section3 = `Looking ahead, the intersection of tradition and independent execution offers a compelling roadmap for the coming decade. As decentralized tools empower smaller studios, autonomous writers, and boutique artisans, the leverage once held exclusively by centralized institutions is dispersing. What remains indispensable is an unwavering dedication to aesthetic rigor and authentic provenance.`;

  const section4 = `Ultimately, engaging deeply with stories like this invites us to recalibrate our own daily standards. By prioritizing slow reflection over hasty consumption, we carve out sanctuary amidst modern acceleration—reclaiming our capacity to observe, appreciate, and contribute thoughtfully to the culture around us.`;

  const enrichedContent = [
    intro,
    subheading1,
    section1,
    section2,
    subheading2,
    section3,
    section4,
  ].join("\n\n");

  const wordCount = enrichedContent.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(4, Math.round(wordCount / 180));

  return {
    content: enrichedContent,
    readTimeMinutes,
  };
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

      const { content, readTimeMinutes } = enrichEditorialArticle(
        item.webTitle,
        trail || item.webTitle,
        body,
        category
      );

      return {
        title: item.webTitle,
        excerpt: trail || item.webTitle,
        content,
        category,
        coverImage:
          item.fields?.thumbnail ||
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
        readTimeMinutes,
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
      const rawContent = (art.content || desc).replace(/<[^>]+>/g, "").trim();

      const { content, readTimeMinutes } = enrichEditorialArticle(
        art.title,
        desc || art.title,
        rawContent,
        "Culture & Art"
      );

      return {
        title: art.title,
        excerpt: desc || art.title,
        content,
        category: "Culture & Art",
        coverImage:
          art.image ||
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80",
        readTimeMinutes,
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

    return data.map((item: any) => {
      const desc = item.description || item.title;
      const { content, readTimeMinutes } = enrichEditorialArticle(
        item.title,
        desc,
        desc,
        "Design"
      );

      return {
        title: item.title,
        excerpt: desc,
        content,
        category: "Design",
        coverImage:
          item.cover_image ||
          item.social_image ||
          "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
        readTimeMinutes,
        authorName: item.user?.name || "Design Collective",
      };
    });
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

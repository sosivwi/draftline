import { NextResponse } from "next/server";
import { getLivePosts } from "@/lib/supabase-posts";

export const revalidate = 86400; // 24-hour daily freshness

export async function GET() {
  try {
    const stories = await getLivePosts();

    return NextResponse.json(
      {
        success: true,
        stories,
        total: stories.length,
        updatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/stories/daily:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch daily stories" },
      { status: 500 }
    );
  }
}

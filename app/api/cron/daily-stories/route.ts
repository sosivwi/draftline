import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { generateDailyStories } from "@/lib/daily-stories";

export const dynamic = "force-dynamic";

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

  try {
    const result = await generateDailyStories({ force: true });

    // Revalidate cache on key editorial routes
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath("/topics");
    revalidatePath("/api/stories/daily");

    return NextResponse.json(result);
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

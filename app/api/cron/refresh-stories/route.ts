import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  // Support optional CRON_SECRET header check if environment variable is present
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Purge cached paths to sync the freshest daily editorial stories
    revalidatePath("/");
    revalidatePath("/posts/[slug]", "page");
    revalidatePath("/api/stories/daily");

    return NextResponse.json({
      success: true,
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: "Daily editorial stories and cache purged successfully.",
    });
  } catch (error) {
    console.error("Error in /api/cron/refresh-stories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh daily stories.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}

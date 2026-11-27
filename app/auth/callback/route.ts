import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawNext = requestUrl.searchParams.get("next") ?? "/";
  // Safe redirect check: ensure next is a relative path to prevent open redirect
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";
  const errorDescription = requestUrl.searchParams.get("error_description");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  const baseOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin;

  const nextQuery = next !== "/" ? `&next=${encodeURIComponent(next)}` : "";

  if (errorDescription) {
    return NextResponse.redirect(
      `${baseOrigin}/login?error=${encodeURIComponent(errorDescription)}${nextQuery}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseOrigin}${next}`);
    } else {
      return NextResponse.redirect(
        `${baseOrigin}/login?error=${encodeURIComponent(error.message)}${nextQuery}`
      );
    }
  }

  return NextResponse.redirect(
    `${baseOrigin}/login?error=Could%20not%20authenticate%20user${nextQuery}`
  );
}

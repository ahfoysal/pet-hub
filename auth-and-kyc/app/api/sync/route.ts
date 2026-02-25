import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  console.log("Sync API: Token presence check:", token ? "Token Found" : "Token MISSING");
  if (!token) {
    console.log("Sync API: All cookies for debugging:");
    request.cookies.getAll().forEach(c => console.log(`Cookie: ${c.name}`));
  }

  if (!callbackUrl) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const redirectUrl = new URL(callbackUrl, request.url);
    if (token) {
      console.log("Sync API: Appending sync_token to redirectUrl");
      redirectUrl.searchParams.set("sync_token", token);
    } else {
      console.warn("Sync API: Redirecting WITHOUT sync_token (Session likely lost)");
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Failed to construct redirect URL:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl");

  // Verify the user has a valid session established on the current domain (.lvh.me)
  const session = await getServerSession(authOptions);

  if (!session) {
    // If no session is found, force the user back to the login page
    console.warn("API Sync: No session found, redirecting to login.");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (callbackUrl && callbackUrl.startsWith("http")) {
    // By passing through this route, NextAuth's internal logic will have correctly
    // set the 'next-auth.session-token' cookie on the client.
    // Now we can safely redirect the user to their subdomain dashboard.
    console.log("API Sync: Session found, redirecting to", callbackUrl);
    
    // We optionally add a cache-busting timestamp so the destination router doesn't use a cached unauthenticated state
    const separator = callbackUrl.includes("?") ? "&" : "?";
    const finalUrl = `${callbackUrl}${separator}sst=${Date.now()}`;
    
    return NextResponse.redirect(finalUrl);
  }

  // Fallback redirect if no valid callbackUrl is provided
  console.log("API Sync: No valid callbackUrl, redirecting to home.");
  return NextResponse.redirect(new URL("/", req.url));
}

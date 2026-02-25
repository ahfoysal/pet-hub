// lib/refreshAccessToken.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.refreshToken}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok || !data?.success) throw new Error("Refresh failed");

    return {
      ...token,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
    };
  } catch (error) {
    console.error("Refresh token error", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

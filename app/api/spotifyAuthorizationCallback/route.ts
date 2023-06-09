import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.getAll("code");
  const state = req.nextUrl.searchParams.getAll("state");
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = "http://localhost:3000/api/spotifyAuthorizationCallback";

  if (state === null) {
    return NextResponse.redirect(
      "http://localhost:3000/" +
        querystring.stringify({ error: "state_mismatch" })
    );
  }

  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const authOptions = {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  };

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    authOptions
  );

  const data = await response.json();
  const url = new URL(
    "http://localhost:3000/spotifyAuthorizationToken?" +
      querystring.stringify({ access_token: data.access_token })
  );

  return NextResponse.redirect(url);
}

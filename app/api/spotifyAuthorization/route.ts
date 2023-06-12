import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import querystring from "querystring";

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const rootURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://juniusfree-song-book.vercel.app";
  const redirectUri = rootURL + `/api/spotifyAuthorizationCallback`;
  console.log("redirectUri", redirectUri);
  const state = randomUUID();
  const scope = "user-read-email";

  const loginLink =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state,
    });

  console.log("loginLink", loginLink);
  return NextResponse.redirect(new URL(loginLink));
}

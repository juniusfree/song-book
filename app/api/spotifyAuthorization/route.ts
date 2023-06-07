import { NextResponse } from "next/server";

export async function GET() {
  const authorization = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`,
  }).then((res) => res.json());
  return NextResponse.json({ data: authorization });
}

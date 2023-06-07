import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { data: authorization } = await fetch(
    "http://localhost:3000/api/spotifyAuthorization"
  ).then((res) => res.json());

  const res = await fetch(
    `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
    {
      method: "GET",
      headers: {
        Authorization: `${authorization.token_type} ${authorization.access_token}`,
      },
    }
  ).then((res) => res.json());

  return NextResponse.json({ data: res });
}

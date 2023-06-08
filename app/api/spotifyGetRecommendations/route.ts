import { NextResponse } from "next/server";

const removeSpaces = (str: string) => str.replace(/\s*,\s*/g, ",");

export async function POST(req: Request) {
  const { genres } = await req.json();
  const { data: authorization } = await fetch(
    "http://localhost:3000/api/spotifyAuthorization"
  ).then((res) => res.json());

  const apiLink = `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${removeSpaces(
    genres
  )}`;

  const res = await fetch(apiLink, {
    method: "GET",
    headers: {
      Authorization: `${authorization.token_type} ${authorization.access_token}`,
    },
  }).then((res) => res.json());

  return NextResponse.json({ data: res });
}

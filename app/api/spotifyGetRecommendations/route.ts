import { NextResponse } from "next/server";

const removeSpaces = (str: string) => str.replace(/\s*,\s*/g, ",");

export async function POST(req: Request) {
  const { genres } = await req.json();
  const accessToken = req.headers.get("authorization");
  const apiLink = `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${removeSpaces(
    genres
  )}`;

  const res = await fetch(apiLink, {
    method: "GET",
    headers: {
      Authorization: `${accessToken}`,
    },
  }).then((res) => res.json());

  return NextResponse.json({ data: res });
}

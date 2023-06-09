import { NextResponse } from "next/server";

export async function GET(req: Request) {
 const accessToken = req.headers.get("authorization");

 const res = await fetch(
   `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
   {
     method: "GET",
     headers: {
       Authorization: `${accessToken}`,
     },
   }
 ).then((res) => res.json());

  return NextResponse.json({ data: res });
}

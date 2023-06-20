import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { key } = await req.json();
  const res = await fetch(`https://openlibrary.org/${key}.json`);
  const data = await res.json();
  return NextResponse.json({ data });
}

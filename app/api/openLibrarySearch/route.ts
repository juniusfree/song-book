import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();
  const searchResult = await fetch(
    `https://openlibrary.org/search.json?q="${query}"`
  );
  const searchResultJson = await searchResult.json();
  const searchResultDocs = searchResultJson?.docs
    ?.slice(0, 10)
    .map(async ({ key }: { key: string }) => {
      const res = await fetch(`https://openlibrary.org/${key}.json`);
      const works = await res.json();
      return works;
    });
  const result = await Promise.all(searchResultDocs);
  const filteredResult = result.filter((doc) => doc?.description);
  return NextResponse.json({ data: filteredResult });
}

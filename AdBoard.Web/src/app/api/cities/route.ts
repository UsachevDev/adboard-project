// src/app/api/cities/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  if (!q) return NextResponse.json({ suggestions: [] });

  try {
    const resp = await fetch(
      `https://api.teleport.org/api/cities/?search=${encodeURIComponent(
        q
      )}&limit=5`
    );
    const data = await resp.json();
    const results = data._embedded?.["city:search-results"] || [];
    const suggestions = results.map((item: any) => item.matching_full_name);
    return NextResponse.json({ suggestions });
  } catch (err) {
    console.error("Teleport API error:", err);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}

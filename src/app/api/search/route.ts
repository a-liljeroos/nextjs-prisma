import { search } from "./_functions";
import { auth } from "@serverAuth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/search/route.ts

const schema = z
  .object({
    q: z.string().min(3).max(20),
  })
  .required();

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    const params = req.nextUrl.searchParams;
    const result = schema.safeParse({ q: params.get("q") });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    let { q } = result.data;

    q = q.trim();
    q = q.split(" ")[0];

    const searchResults = await search(q);

    return NextResponse.json(searchResults, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

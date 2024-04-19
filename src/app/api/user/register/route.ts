import { hash } from "@bcrypt/functions";
import { db } from "@prisma/db";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

// api/user/register

const schema = z
  .object({
    name: z.string().min(3).max(30),
    password: z.string().min(6).max(60),
    email: z.string().email().nullable(),
  })
  .required({ username: true, password: true });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { name, password, email } = result.data;

    const user = await db.getUserByName(name);

    if (user && user.length > 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hashedPassword: string = await hash(password);

    const newUser = {
      name: name,
      password: hashedPassword,
      email: email,
    };

    const dbRes = await db.insertUser(newUser);

    return NextResponse.json(dbRes, { status: 201 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

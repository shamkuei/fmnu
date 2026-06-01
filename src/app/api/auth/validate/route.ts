import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db/index";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session-id")?.value;

  if (!sessionId) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  const session = await db.query.sessions.findFirst({
    where: { id: sessionId },
    columns: { id: true, revokedAt: true, expireAt: true },
  });

  if (
    !session ||
    session.revokedAt ||
    (session.expireAt && session.expireAt <= new Date())
  ) {
    const res = NextResponse.json({ valid: false }, { status: 401 });
    res.cookies.delete("session-id");
    return res;
  }

  return NextResponse.json({ valid: true });
}

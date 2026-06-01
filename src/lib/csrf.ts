import { headers } from "next/headers";
import { ForbiddenException } from "./errors";

export async function verifyOrigin() {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("host");

  if (!origin || !host) {
    throw new ForbiddenException("CSRF_ORIGIN_MISSING");
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new ForbiddenException("CSRF_INVALID_ORIGIN");
  }

  if (originHost !== host) {
    throw new ForbiddenException("CSRF_ORIGIN_MISMATCH");
  }
}

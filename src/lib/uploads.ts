import { join } from "node:path";

/**
 * Where uploaded files are stored on disk.
 *
 * In production this path is backed by the persistent `uploads` Docker volume
 * (see docker-compose.yml: `uploads:/app/public/uploads`), so files survive
 * restarts. We deliberately serve these via a route handler
 * (`src/app/uploads/[...path]/route.ts`) rather than relying on Next's `public/`
 * static serving — files written to `public/` at runtime are not reliably
 * served under `output: "standalone"`.
 */
export const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function contentTypeFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

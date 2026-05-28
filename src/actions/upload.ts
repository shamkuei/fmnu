"use server";

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("فایلی انتخاب نشده");

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("فرمت فایل مجاز نیست (فقط jpg, png, webp, gif)");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
  }

  if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(join(UPLOAD_DIR, name), buffer);

  return { url: `/uploads/${name}` };
}

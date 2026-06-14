import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/heic": ".heic",
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Image too large (max 8MB)" },
      { status: 413 }
    );
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WebP, GIF or HEIC images are allowed" },
      { status: 415 }
    );
  }

  const dir = path.join(process.cwd(), "data", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const name = `${crypto.randomBytes(12).toString("hex")}${ext}`;
  await fs.writeFile(
    path.join(dir, name),
    Buffer.from(await file.arrayBuffer())
  );

  return NextResponse.json({ path: `/api/uploads/${name}` }, { status: 201 });
}

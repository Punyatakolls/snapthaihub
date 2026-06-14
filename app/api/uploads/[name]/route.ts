import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { UPLOADS_DIR } from "@/lib/paths";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  // Filenames are server-generated hex + extension; reject anything else
  if (!/^[a-f0-9]{24}\.(jpg|png|webp|gif|heic)$/.test(name)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const filePath = path.join(UPLOADS_DIR, name);
  try {
    const data = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": TYPES[path.extname(name)] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

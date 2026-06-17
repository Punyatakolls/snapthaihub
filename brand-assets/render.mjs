// Render the brand SVGs to PNGs with sharp.
// Run: node brand-assets/render.mjs
import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => readFileSync(path.join(dir, f));
const out = (f) => path.join(dir, f);

const jobs = [
  { src: "avatar.svg", out: "avatar-1024.png", width: 1024 },
  { src: "avatar.svg", out: "avatar-512.png", width: 512 },
  { src: "logo-horizontal.svg", out: "logo-horizontal.png", width: 1120 },
  { src: "logo-horizontal.svg", out: "logo-horizontal@2x.png", width: 2240 },
  { src: "banner.svg", out: "banner.png", width: 1500 },
];

for (const j of jobs) {
  await sharp(read(j.src), { density: 384 })
    .resize({ width: j.width })
    .png()
    .toFile(out(j.out));
  console.log("wrote", j.out);
}

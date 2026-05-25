import sharp from "sharp";
import { readdir, stat, unlink } from "fs/promises";
import { join, extname, dirname, basename } from "path";

const ROOT = new URL("../public/cafes/menus", import.meta.url).pathname;
const SIZE = 200;

async function walk(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const e of entries) {
    const full = join(dir, e);
    const s = await stat(full);
    if (s.isDirectory()) files.push(...(await walk(full)));
    else if ([".jpg", ".jpeg", ".png"].includes(extname(e).toLowerCase())) files.push(full);
  }
  return files;
}

const files = await walk(ROOT);
console.log(`변환 대상: ${files.length}장`);

let converted = 0;
let savedBytes = 0;

for (const src of files) {
  const dest = join(dirname(src), basename(src, extname(src)) + ".webp");
  const before = (await stat(src)).size;
  await sharp(src).resize(SIZE, SIZE, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).webp({ quality: 82 }).toFile(dest);
  const after = (await stat(dest)).size;
  savedBytes += before - after;
  await unlink(src);
  converted++;
  if (converted % 20 === 0) console.log(`  ${converted}/${files.length}...`);
}

console.log(`완료: ${converted}장 변환, ${(savedBytes / 1024 / 1024).toFixed(1)}MB 절약`);

import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const fullPath = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(fullPath) : fullPath;
      })
    )
  ).flat();
};

const sourceFiles = [
  ...(await walk(path.join(root, "src"))),
  ...(await walk(path.join(publicDir, "messages"))),
].filter((file) => /\.(?:js|jsx|mjs|ts|tsx|css|json)$/.test(file));
const referenced = new Set();
for (const file of sourceFiles) {
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(/["'`](\/images\/[^"'`?#)]+)/g)) {
    referenced.add(match[1].replaceAll("/", path.sep));
  }
}

const imageFiles = (await walk(path.join(publicDir, "images"))).filter((file) =>
  /\.(?:avif|gif|heic|jpe?g|png|svg|webp)$/i.test(file)
);
const publicPaths = new Set(
  imageFiles.map((file) => file.slice(publicDir.length).replaceAll(path.sep, "/"))
);
const missing = [...referenced]
  .map((file) => file.replaceAll(path.sep, "/"))
  .filter((file) => !publicPaths.has(file));
const unused = imageFiles.filter(
  (file) => !referenced.has(file.slice(publicDir.length))
);
const oversized = [];
const hashes = new Map();

for (const file of imageFiles) {
  const info = await stat(file);
  if (info.size > 1024 * 1024) oversized.push([file, info.size]);
  const hash = createHash("sha256").update(await readFile(file)).digest("hex");
  hashes.set(hash, [...(hashes.get(hash) || []), file]);
}

const duplicates = [...hashes.values()].filter((files) => files.length > 1);
console.log(JSON.stringify({
  totalImages: imageFiles.length,
  staticReferences: referenced.size,
  missingReferences: missing,
  unusedCandidates: unused.map((file) => path.relative(root, file)),
  oversized: oversized.map(([file, size]) => ({ file: path.relative(root, file), megabytes: +(size / 1024 / 1024).toFixed(2) })),
  exactDuplicates: duplicates.map((files) => files.map((file) => path.relative(root, file))),
}, null, 2));

if (missing.length) process.exitCode = 1;

import { gzipSync } from "node:zlib";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");
const appDir = path.join(nextDir, "server", "app");
const budgetKb = Number(process.env.CLIENT_ROUTE_BUDGET_KB || 350);

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

const manifestFiles = (await walk(appDir)).filter((file) =>
  file.endsWith("_client-reference-manifest.js")
);
const failures = [];

for (const manifestFile of manifestFiles) {
  const source = await readFile(manifestFile, "utf8");
  const assignment = source.trim().split(/\r?\n/).at(-1);
  const separatorIndex = assignment.indexOf(" = ");
  const manifest = JSON.parse(
    assignment.slice(separatorIndex + 3).replace(/;$/, "")
  );
  const jsFiles = [
    ...new Set(Object.values(manifest.entryJSFiles || {}).flat()),
  ].filter((file) => file.endsWith(".js"));
  let compressedBytes = 0;

  for (const file of jsFiles) {
    const sourceFile = await readFile(path.join(nextDir, file));
    compressedBytes += gzipSync(sourceFile).byteLength;
  }

  const route = path
    .relative(appDir, manifestFile)
    .replaceAll(path.sep, "/")
    .replace(/_client-reference-manifest\.js$/, "");
  const compressedKb = compressedBytes / 1024;
  console.log(`${route}: ${compressedKb.toFixed(1)} KiB gzip`);
  if (compressedKb > budgetKb) failures.push({ route, compressedKb });
}

if (failures.length) {
  console.error(`Client route budget exceeded (${budgetKb} KiB gzip):`, failures);
  process.exitCode = 1;
}

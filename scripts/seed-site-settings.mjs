/**
 * Patches siteSettings.monobankJarUrl. Does not replace other fields.
 * Usage: node --env-file=.env.local scripts/seed-site-settings.mjs
 * Auth: SANITY_API_TOKEN or Sanity CLI login (~/.config/sanity/config.json).
 */
import {existsSync, readFileSync} from "node:fs";
import {join} from "node:path";

const loadSanityCliAuthToken = () => {
  const homeDirectory = process.env.HOME || process.env.USERPROFILE;
  if (!homeDirectory) return undefined;
  const configPath = join(homeDirectory, ".config", "sanity", "config.json");
  if (!existsSync(configPath)) return undefined;
  try {
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    return typeof config.authToken === "string" && config.authToken.trim()
      ? config.authToken.trim()
      : undefined;
  } catch {
    return undefined;
  }
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vintpwoh";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-05-15";
const token = process.env.SANITY_API_TOKEN || loadSanityCliAuthToken();

if (!token) {
  console.error("SANITY_API_TOKEN is required, or login via Sanity CLI (`npx sanity login`)");
  process.exit(1);
}

const jarUrl = "https://send.monobank.ua/jar/9sNTEdMP79";
const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    mutations: [
      {
        createIfNotExists: {
          _id: "siteSettings",
          _type: "siteSettings",
        },
      },
      {
        patch: {
          id: "siteSettings",
          set: {
            monobankJarUrl: jarUrl,
          },
        },
      },
    ],
  }),
});

if (!res.ok) {
  console.error("Seed failed", res.status, await res.text());
  process.exit(1);
}

const result = await res.json();
console.log("siteSettings.monobankJarUrl patched", jarUrl);
console.log(JSON.stringify(result, null, 2));

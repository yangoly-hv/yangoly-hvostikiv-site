/**
 * Seeds the siteSettings singleton with current Instagram + Facebook URLs.
 * Usage: node --env-file=.env.local scripts/seed-site-settings.mjs
 * Requires SANITY_API_TOKEN (write) and NEXT_PUBLIC_SANITY_PROJECT_ID.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vintpwoh";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-05-15";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("SANITY_API_TOKEN is required to seed siteSettings");
  process.exit(1);
}

const doc = {
  _id: "siteSettings",
  _type: "siteSettings",
  instagram: "https://www.instagram.com/yangoli_hvostikiv/",
  facebook: "https://www.facebook.com/YangoliHvostikiv",
};

const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;

const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    mutations: [{ createOrReplace: doc }],
  }),
});

if (!res.ok) {
  console.error("Seed failed", res.status, await res.text());
  process.exit(1);
}

console.log("siteSettings seeded");

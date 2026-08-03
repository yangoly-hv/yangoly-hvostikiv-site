const siteUrl = process.env.REVALIDATE_SITE_URL;
const secret = process.env.REVALIDATE_OPS_SECRET;

if (!siteUrl || !secret) {
  console.error("Set REVALIDATE_SITE_URL and REVALIDATE_OPS_SECRET first");
  process.exit(1);
}

const response = await fetch(new URL("/api/revalidate/all", siteUrl), {
  method: "POST",
  headers: { Authorization: `Bearer ${secret}` },
});
const result = await response.text();

if (!response.ok) {
  console.error(`Full revalidation failed (${response.status}): ${result}`);
  process.exit(1);
}

console.log(result);

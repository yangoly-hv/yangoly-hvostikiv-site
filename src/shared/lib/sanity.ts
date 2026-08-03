import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "vintpwoh",
  dataset: "production",
  apiVersion: "2025-05-15",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "published",
});

export default client;

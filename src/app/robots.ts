import type { MetadataRoute } from "next";
import { siteUrl } from "@/shared/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/uk/preview/",
        "/en/preview/",
        "/uk/event-registration",
        "/en/event-registration",
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}

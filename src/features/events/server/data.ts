import "server-only";

import { cache } from "react";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";

export type CharityEventsContent = {
  title?: Partial<Record<"uk" | "en", string>>;
  images: string[];
};

const eventsQuery = `
  *[_type == "events" && _id == "events"][0]{
    title,
    "images": images[].asset->url
  }
`;

export const getCharityEvents = cache(() =>
  sanityFetch<CharityEventsContent | null>(eventsQuery, {}, {
    tags: [sanityTags.events],
  })
);

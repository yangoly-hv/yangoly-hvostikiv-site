import "server-only";

import { createClient, type QueryParams } from "@sanity/client";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vintpwoh";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityApiVersion = process.env.SANITY_API_VERSION || "2025-05-15";
const isDevelopment = process.env.NODE_ENV === "development";

export const sanityReadClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  perspective: "published",
  useCdn: !isDevelopment,
});

type SanityFetchOptions = {
  tags: string[];
};

/**
 * Fetch published Sanity content and keep it cached until a signed webhook
 * invalidates one of the supplied tags.
 */
export const sanityFetch = <Result>(
  query: string,
  params: QueryParams = {},
  { tags }: SanityFetchOptions
) => {
  if (isDevelopment) {
    return sanityReadClient.fetch<Result>(query, params, {
      cache: "no-store",
    });
  }

  return sanityReadClient.fetch<Result>(query, params, {
    cache: "force-cache",
    next: {
      revalidate: false,
      tags,
    },
  });
};

import "server-only";

import { createClient, type QueryParams } from "@sanity/client";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/shared/lib/sanity.server";

const token = process.env.SANITY_API_READ_TOKEN;

const sanityPreviewClient = token
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      perspective: "drafts",
      useCdn: false,
      token,
    })
  : null;

export const sanityPreviewFetch = <Result>(
  query: string,
  params: QueryParams = {}
) => {
  if (!sanityPreviewClient) {
    throw new Error("SANITY_API_READ_TOKEN is not configured");
  }

  return sanityPreviewClient.fetch<Result>(query, params, {
    cache: "no-store",
  });
};

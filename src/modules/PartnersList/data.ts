import "server-only";

import { cache } from "react";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";

export type Partner = {
  _id: string;
  logoUrl: string;
  websiteUrl: string;
};

type PartnerQueryResult = {
  _id: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
};

const partnersQuery = `
  *[_type == "partner"] | order(_createdAt asc){
    _id,
    "logoUrl": logo.asset->url,
    websiteUrl
  }
`;

export const getPartners = cache(async () => {
  const partners = await sanityFetch<PartnerQueryResult[]>(partnersQuery, {}, {
    tags: [sanityTags.partnersList],
  });

  return partners.filter(
    (partner): partner is Partner =>
      typeof partner.logoUrl === "string" &&
      partner.logoUrl.trim().length > 0 &&
      typeof partner.websiteUrl === "string" &&
      partner.websiteUrl.trim().length > 0
  );
});

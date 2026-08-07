import "server-only";

import { cache } from "react";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";
import {
  filterSocialLinks,
  type SiteSettingsSocialFields,
  type SocialLink,
} from "@/shared/lib/socialLinks";

const siteSettingsQuery = `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    instagram,
    facebook,
    twitter,
    telegram,
    youtube
  }
`;

export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const settings = await sanityFetch<SiteSettingsSocialFields | null>(
    siteSettingsQuery,
    {},
    { tags: [sanityTags.siteSettings] }
  );
  return filterSocialLinks(settings);
});

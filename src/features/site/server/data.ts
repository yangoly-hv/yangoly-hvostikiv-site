import "server-only";

import { cache } from "react";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";
import { parseMonobankJarUrl } from "@/shared/lib/monobankJarUrl";
import {
  filterSocialLinks,
  type SiteSettingsSocialFields,
  type SocialLink,
} from "@/shared/lib/socialLinks";

type SiteSettingsFields = SiteSettingsSocialFields & {
  monobankJarUrl?: string | null;
};

type SiteSettings = {
  socials: SocialLink[];
  oneTimeDonationJarUrl: string | null;
};

const siteSettingsQuery = `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    instagram,
    facebook,
    twitter,
    telegram,
    youtube,
    monobankJarUrl
  }
`;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await sanityFetch<SiteSettingsFields | null>(
    siteSettingsQuery,
    {},
    { tags: [sanityTags.siteSettings] }
  );

  return {
    socials: filterSocialLinks(settings),
    oneTimeDonationJarUrl: parseMonobankJarUrl(settings?.monobankJarUrl),
  };
});

export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  const { socials } = await getSiteSettings();
  return socials;
});

export const getOneTimeDonationJarUrl = cache(async (): Promise<string | null> => {
  const { oneTimeDonationJarUrl } = await getSiteSettings();
  return oneTimeDonationJarUrl;
});

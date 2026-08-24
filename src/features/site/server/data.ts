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
import { parseShowTopDonors } from "../model/showTopDonors";

type SiteSettingsFields = SiteSettingsSocialFields & {
  monobankJarUrl?: string | null;
  showTopDonors?: boolean | null;
};

type SiteSettings = {
  socials: SocialLink[];
  oneTimeDonationJarUrl: string | null;
  showTopDonors: boolean;
};

const siteSettingsQuery = `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    instagram,
    facebook,
    twitter,
    telegram,
    youtube,
    monobankJarUrl,
    showTopDonors
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
    showTopDonors: parseShowTopDonors(settings?.showTopDonors),
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

export const getShowTopDonors = cache(async (): Promise<boolean> => {
  const { showTopDonors } = await getSiteSettings();
  return showTopDonors;
});

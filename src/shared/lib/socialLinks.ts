export const socialNetworks = [
  "instagram",
  "facebook",
  "twitter",
  "telegram",
  "youtube",
] as const;

export type SocialNetwork = (typeof socialNetworks)[number];

export type SocialLink = {
  network: SocialNetwork;
  href: string;
};

const socialHostAllowlists: Record<SocialNetwork, readonly string[]> = {
  instagram: ["instagram.com"],
  facebook: ["facebook.com", "fb.com"],
  twitter: ["twitter.com", "x.com"],
  telegram: ["t.me", "telegram.me", "telegram.org"],
  youtube: ["youtube.com", "youtu.be"],
};

const hostMatchesAllowlist = (hostname: string, allowedHosts: readonly string[]) => {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return allowedHosts.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );
};

export const isValidSocialHref = (
  network: SocialNetwork,
  value: unknown
): value is string => {
  if (typeof value !== "string") return false;
  const href = value.trim();
  if (!href || href === "/" || !href.startsWith("https://")) return false;

  try {
    const { hostname, protocol } = new URL(href);
    if (protocol !== "https:") return false;
    return hostMatchesAllowlist(hostname, socialHostAllowlists[network]);
  } catch {
    return false;
  }
};

export type SiteSettingsSocialFields = Partial<
  Record<SocialNetwork, string | null | undefined>
>;

export const filterSocialLinks = (
  fields: SiteSettingsSocialFields | null | undefined
): SocialLink[] => {
  if (!fields) return [];

  return socialNetworks.flatMap((network) => {
    const href = fields[network];
    return isValidSocialHref(network, href) ? [{ network, href: href.trim() }] : [];
  });
};

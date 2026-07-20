import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder({
  projectId: "vintpwoh",
  dataset: "production",
});

export const urlFor = (source: SanityImageSource) => builder.image(source);

export const tailImageSlots = {
  tailCard: {width: 600, height: 500},
  tailDetailThumb: {width: 300, height: 250},
  tailDetailMain: {width: 900, height: 750},
  tailModal: {width: 1200, height: 1000},
} as const;

export const imageSlots = {
  ...tailImageSlots,
  collectionMonthlyGoal: {width: 705, height: 580},
  reportSlider: {width: 1040, height: 800},
  reportModal: {width: 1560, height: 1200},
} as const;

export type TailImageSlot = keyof typeof tailImageSlots;
export type ImageSlot = keyof typeof imageSlots;

export const imageUrlForSlot = (
  source: (SanityImageSource & {url?: string}) | string | null | undefined,
  slot: ImageSlot
) => {
  if (!source) return "";
  if (typeof source === "string") return source;
  const fallbackUrl = typeof source.url === "string" ? source.url : "";
  const assetRef = "asset" in source ? source.asset?._ref : undefined;

  if (!assetRef) return fallbackUrl;

  const {width, height} = imageSlots[slot];

  try {
    return urlFor(source).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return fallbackUrl;
  }
};

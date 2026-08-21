import "server-only";

import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const builder = createImageUrlBuilder({
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
  donorAvatar: {width: 160, height: 160},
  volunteerPhoto: {width: 640, height: 720},
  reportSlider: {width: 1040, height: 800},
  reportModal: {width: 1560, height: 1200},
} as const;

export type ImageSlot = keyof typeof imageSlots;

export const imageUrlForSlot = (
  source: (SanityImageSource & {url?: string}) | string | null | undefined,
  slot: ImageSlot
) => {
  if (!source) return "";
  if (typeof source === "string") return source;
  const fallbackUrl = typeof source.url === "string" ? source.url : "";
  const asset =
    "asset" in source && source.asset && typeof source.asset === "object"
      ? source.asset
      : undefined;
  const assetRef =
    asset && "_ref" in asset && typeof asset._ref === "string"
      ? asset._ref
      : asset && "_id" in asset && typeof asset._id === "string"
        ? asset._id
        : undefined;

  if (!assetRef) return fallbackUrl;

  const {width, height} = imageSlots[slot];

  try {
    return urlFor(source).width(width).height(height).fit("crop").auto("format").url();
  } catch {
    return fallbackUrl;
  }
};

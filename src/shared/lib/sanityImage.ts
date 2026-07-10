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

export type TailImageSlot = keyof typeof tailImageSlots;

export const imageUrlForSlot = (
  source: SanityImageSource | string | null | undefined,
  slot: TailImageSlot
) => {
  if (!source) return "";
  if (typeof source === "string") return source;

  const {width, height} = tailImageSlots[slot];

  return urlFor(source).width(width).height(height).fit("crop").auto("format").url();
};

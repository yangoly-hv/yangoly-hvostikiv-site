import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder({
  projectId: "vintpwoh",
  dataset: "production",
});

export const urlFor = (source: SanityImageSource) => builder.image(source);

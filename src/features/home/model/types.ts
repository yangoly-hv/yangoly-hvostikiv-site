import type { SanityImage } from "@/shared/types/sanity.types";
import type { PortableTextContentBlock } from "@/shared/types/content.types";

export type ContentBlock = PortableTextContentBlock;

export type Performance = {
  tailsCount: number;
  feedCount: number;
  vaccinesCount: number;
  treatmentsCount: number;
};

export type Donor = {
  _id: string;
  name: string;
  amount: number;
};

export type MainCollection = {
  _id: string;
  title?: Partial<Record<"uk" | "en", string>>;
  description?: Partial<Record<"uk" | "en", ContentBlock[]>>;
  amount?: number;
  amountCollected?: number;
  image?: SanityImage;
};

export type AboutFoundation = {
  title: string;
  description: ContentBlock[];
  imagesDesktop: string[];
  imagesMobile: string[];
};

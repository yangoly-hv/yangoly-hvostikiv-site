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

export type TopDonor = {
  _id: string;
  kind: "person" | "company";
  name: string;
  amount: number;
  image?: SanityImage | null;
  instagramUrl?: string | null;
  telegramUrl?: string | null;
  websiteUrl?: string | null;
};

export type Volunteer = {
  _id: string;
  name: string;
  description: string;
  contribution?: string | null;
  photo?: SanityImage | null;
  instagramUrl?: string | null;
  telegramUrl?: string | null;
  facebookUrl?: string | null;
};

export type MainCollection = {
  _id: string;
  title?: Partial<Record<"uk" | "en", string>>;
  description?: Partial<Record<"uk" | "en", ContentBlock[]>>;
  amount?: number;
  amountCollected?: number;
  /** Widget longJarId for the public Monobank jar API; swapped monthly in Sanity. */
  monobankLongJarId?: string;
  image?: SanityImage;
};

export type AboutFoundation = {
  title: string;
  description: ContentBlock[];
  imagesDesktop: string[];
  imagesMobile: string[];
};

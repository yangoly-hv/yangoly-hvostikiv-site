import type { PortableTextBlock } from "@portabletext/types";
import type { SanityImage } from "@/shared/types/sanity.types";

export type TailDocument = {
  _id: string;
  name: string;
  slug: string;
  description: PortableTextBlock[];
  sex: "boy" | "girl";
  needs_sterilization?: boolean;
  needs_family: boolean;
  sterilization_price?: number;
  keeping_price?: number;
  mainImage?: SanityImage;
  mainImageUrl?: string;
  images?: SanityImage[];
  imageUrls?: string[];
  updatedAt?: string;
};

export type TailViewModel = {
  id: string;
  slug: string;
  image: string;
  cardImage?: string;
  images: string[];
  galleryImages: string[];
  name: string;
  description: PortableTextBlock[];
  mainText: PortableTextBlock[];
  sex: string;
  sterilized: string;
  categories: string[];
  sterilization_price?: number;
  keeping_price?: number;
};

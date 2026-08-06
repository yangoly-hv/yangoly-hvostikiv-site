import type { PortableTextBlock } from "@portabletext/types";

export type BlogContentBlock =
  | {
      _key: string;
      _type: "blogTextWithImageBlock";
      content: PortableTextBlock[];
      image: string;
      imageAlt?: string;
      imageSide: "left" | "right";
    }
  | {
      _key: string;
      _type: "blogPlainTextBlock";
      content: PortableTextBlock[];
    }
  | {
      _key: string;
      _type: "blogSingleImageBlock";
      image: string;
      imageAlt?: string;
    }
  | {
      _key: string;
      _type: "blogGalleryBlock";
      images: Array<{ url: string; alt?: string }>;
    };

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  description: PortableTextBlock[];
  mainImage: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  readingTime?: number;
  content?: BlogContentBlock[];
  additionalInfo?: PortableTextBlock[];
  secondaryImage?: string;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  date: string;
  title: string;
  description: PortableTextBlock[];
  mainPhoto: string;
};

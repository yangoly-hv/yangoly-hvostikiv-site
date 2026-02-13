/** Portable Text block (Sanity block content) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlock = any[];

export interface BlogTextWithImageBlock {
  _key: string;
  _type: "blogTextWithImageBlock";
  content: PortableTextBlock;
  image: string;
  imageAlt?: string;
  imageSide: "left" | "right";
}

export interface BlogPlainTextBlock {
  _key: string;
  _type: "blogPlainTextBlock";
  content: PortableTextBlock;
}

export interface BlogSingleImageBlock {
  _key: string;
  _type: "blogSingleImageBlock";
  image: string;
  imageAlt?: string;
}

export interface BlogGalleryBlockImage {
  url: string;
  alt?: string;
}

export interface BlogGalleryBlock {
  _key: string;
  _type: "blogGalleryBlock";
  images: BlogGalleryBlockImage[];
}

export type BlogContentBlock =
  | BlogTextWithImageBlock
  | BlogPlainTextBlock
  | BlogSingleImageBlock
  | BlogGalleryBlock;

export interface PostWithContent {
  _id: string;
  title: string;
  slug: string;
  description: PortableTextBlock;
  mainImage: string;
  publishedAt?: string;
  /** Legacy schema; getBlogItemData uses publishedAt ?? createdAt for date */
  createdAt?: string;
  readingTime?: number;
  content?: BlogContentBlock[];
  /** Legacy schema */
  additionalInfo?: PortableTextBlock;
  secondaryImage?: string;
}

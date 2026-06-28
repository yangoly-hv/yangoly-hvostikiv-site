export function extractFirstParagraphText(html: string): string;

export function extractTextFromHTML(htmlString: string): string;

export function extractParagraphs(htmlString: string): string[];

/** Input shape for getTailData (tail from Sanity). */
export interface GetTailDataInput {
  _id: string;
  slug: string;
  mainImage: string;
  mainImageForCrop?: unknown;
  images?: string[];
  imagesForCrop?: unknown[];
  sex: string;
  name: string;
  description: unknown;
  sterilization_price?: number;
  keeping_price?: number;
  needs_family: boolean;
  needs_sterilization?: boolean;
}

export function getTailData(
  tail: GetTailDataInput,
  lang: string
): {
  id: string;
  image: string;
  cardImage: unknown;
  slug: string;
  images: string[];
  galleryImages: unknown[];
  name: string;
  sterilization_price?: number;
  keeping_price?: number;
  sex: string;
  sterilized: string;
  categories: string[];
  description: unknown;
  mainText: unknown;
};

/** Input shape for getBlogItemData (legacy + new schema; createdAt/publishedAt optional). */
export interface GetBlogItemDataInput {
  _id: string;
  slug: string;
  title: string;
  description: unknown;
  mainImage: string;
  createdAt?: string;
  publishedAt?: string;
  additionalInfo?: unknown;
  secondaryImage?: string;
}

export function getBlogItemData(post: GetBlogItemDataInput): {
  id: string;
  slug: string;
  date: string;
  title: string;
  description: unknown;
  mainText: unknown;
  mainPhoto: string;
  secondaryPhoto: string | undefined;
  mainPart: unknown;
};

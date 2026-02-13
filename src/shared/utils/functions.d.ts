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

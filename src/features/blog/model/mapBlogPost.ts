import type { AppLocale } from "@/shared/config/site";
import type { BlogPost, BlogPostSummary } from "./types";

export const mapBlogPostSummary = (
  post: BlogPost,
  locale: AppLocale
): BlogPostSummary => ({
  id: post._id,
  slug: post.slug,
  date: post.publishedAt
    ? new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US").format(
        new Date(post.publishedAt)
      )
    : "",
  title: post.title,
  description: post.description || [],
  mainPhoto: post.mainImage,
});

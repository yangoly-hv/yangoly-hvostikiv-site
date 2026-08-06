import { BlogBlockContent } from "@/features/blog/ui";
import type { BlogPost } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types/dictionary.types";
import BlogArticleHero from "./BlogArticleHero";

interface Props {
  article: BlogPost;
  translation: IBlog;
}

export default function BlogArticleWithContent({
  article,
  translation,
}: Props) {
  const { title, description, mainImage, readingTime, content } = article;
  const { timeToRead } = translation;
  const displayReadingTime = readingTime ?? 1;

  return (
    <section className="text-dark mx-auto container pt-[60px] lg:pt-[96px] pb-[60px]">
      <div className="container px-4 xl:px-10">
        <BlogArticleHero
          title={title}
          description={description}
          mainImage={mainImage}
          readingTime={displayReadingTime}
          timeToRead={timeToRead}
        />
        </div>
      {content && content.length > 0 && (
        <BlogBlockContent blocks={content} />
      )}
    </section>
  );
}

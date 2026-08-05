import type { BlogPost } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types";
import * as motion from "motion/react-client";
import { slideUpAt } from "@/shared/utils";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import BlogArticleHero from "./BlogArticleHero";

export default function BlogArticle({
  article,
  translation,
}: {
  article: BlogPost;
  translation: IBlog;
}) {
  const { title, description, mainImage, secondaryImage, additionalInfo } = article;
  const { timeToRead } = translation;

  const readingTime = 1;

  return (
    <section className="text-dark mx-auto container pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px] px-4 xl:px-10">
      <BlogArticleHero
        title={title}
        description={description}
        mainImage={mainImage}
        readingTime={readingTime}
        timeToRead={timeToRead}
      />
      {additionalInfo ? (
        <div className="mb-[60px] lg:mb-[96px] text-[14px] lg:text-[18px] font-light leading-[130%]">
          <PortableTextRenderer value={additionalInfo} />
        </div>
      ) : null}
      {secondaryImage && <motion.div
        variants={slideUpAt(0.6)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative w-full max-w-[585px] lg:max-w-full aspect-328/189 lg:aspect-1429/455 mx-auto lg:mx-0"
      >
        <Image
          src={secondaryImage}
          alt={title}
          fill
          className="rounded-[18.05px] object-cover object-center"
          sizes="(max-width: 1024px) 100vw, 100vw"
        />
      </motion.div>}
    </section>
  );
}
import Image from "next/image";

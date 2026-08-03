"use client";

import Image from "next/image";
import ClockIcon from "../../../public/images/icons/ClockIcon";
import * as motion from "motion/react-client";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import { BlogBlockContent } from "@/features/blog/ui";
import type { BlogPost } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types/dictionary.types";

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
        <div className="lg:flex items-center justify-between gap-x-[141px] mb-[60px] lg:mb-12">
          <div className="lg:w-[49.3%] mb-[44px] lg:mb-0">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              className="mb-7 text-[32px] lg:text-[40px] font-bold leading-[130%]"
            >
              {title}
            </motion.h1>
            {description?.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut", delay: 0.1 },
                  },
                }}
                className="mb-7 text-[14px] lg:text-[18px] font-light leading-[130%]"
              >
                <PortableTextRenderer value={description} />
              </motion.div>
            )}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut", delay: 0.2 },
                },
              }}
              className="flex items-center gap-x-3"
            >
              <ClockIcon className="size-5 lg:size-[27px]" />
              <span className="text-[20px] lg:text-[24px] font-bold leading-[130%]">
                {displayReadingTime}
                {timeToRead}
              </span>
            </motion.div>
          </div>
          {mainImage && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut", delay: 0.3 },
                },
              }}
              className="relative w-full lg:w-[40.8%] max-w-[585px] h-[383px] mx-auto lg:mx-0"
            >
              <Image
                src={mainImage}
                alt={title}
                fill
                className="object-cover object-center rounded-[18.05px]"
                sizes="(max-width: 1024px) 100vw, 40.8vw"
              />
            </motion.div>
            )}
          </div>
        </div>
      {content && content.length > 0 && (
        <BlogBlockContent blocks={content} />
      )}
    </section>
  );
}

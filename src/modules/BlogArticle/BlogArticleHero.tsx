import Image from "next/image";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";

import ClockIcon from "../../../public/images/icons/ClockIcon";
import type { BlogPost } from "@/features/blog/model/types";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";

type BlogArticleHeroProps = Pick<
  BlogPost,
  "title" | "description" | "mainImage"
> & {
  readingTime: number;
  timeToRead: string;
};

const reveal = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  },
});

export default function BlogArticleHero({
  title,
  description,
  mainImage,
  readingTime,
  timeToRead,
}: BlogArticleHeroProps) {
  return (
    <div className="mb-[60px] items-center justify-between gap-x-[141px] lg:mb-12 lg:flex">
      <div className="mb-[44px] lg:mb-0 lg:w-[49.3%]">
        <motion.h1
          variants={reveal(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-7 text-[32px] font-bold leading-[130%] lg:text-[40px]"
        >
          {title}
        </motion.h1>
        {description.length > 0 && (
          <motion.div
            variants={reveal(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-7 text-[14px] font-light leading-[130%] lg:text-[18px]"
          >
            <PortableTextRenderer value={description} />
          </motion.div>
        )}
        <motion.div
          variants={reveal(0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-x-3"
        >
          <ClockIcon className="size-5 lg:size-[27px]" />
          <span className="text-[20px] font-bold leading-[130%] lg:text-[24px]">
            {readingTime}
            {timeToRead}
          </span>
        </motion.div>
      </div>
      {mainImage && (
        <motion.div
          variants={reveal(0.6)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mx-auto h-[383px] w-full max-w-[585px] lg:mx-0 lg:w-[40.8%]"
        >
          <Image
            src={mainImage}
            alt={title}
            fill
            className="rounded-[18.05px] object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 40.8vw"
          />
        </motion.div>
      )}
    </div>
  );
}

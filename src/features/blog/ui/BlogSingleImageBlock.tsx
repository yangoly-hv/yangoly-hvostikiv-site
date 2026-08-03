"use client";

import * as motion from "motion/react-client";
import Image from "next/image";
import type { BlogContentBlock } from "../model/types";

type BlogSingleImageBlockType = Extract<
  BlogContentBlock,
  { _type: "blogSingleImageBlock" }
>;

interface Props {
  block: BlogSingleImageBlockType;
}

export default function BlogSingleImageBlock({ block }: Props) {
  const { image, imageAlt } = block;
  if (!image) return null;

  return (
    <section className="pb-[60px]">
      <div className="container mx-auto px-4 xl:px-[40px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" },
            },
          }}
          className="relative w-full mx-auto h-full min-h-[568px] max-h-[568px] rounded-[8px] overflow-hidden"
        >
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 898px"
          />
        </motion.div>
      </div>
    </section>
  );
}

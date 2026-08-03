"use client";

import * as motion from "motion/react-client";
import Image from "next/image";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import type { BlogContentBlock } from "../model/types";

type BlogTextWithImageBlockType = Extract<
  BlogContentBlock,
  { _type: "blogTextWithImageBlock" }
>;

interface Props {
  block: BlogTextWithImageBlockType;
}

/** Same layout pattern as charity-events Paragraphs (image left) and Mission (image right). */
export default function BlogTextWithImageBlock({ block }: Props) {
  const { content, image, imageAlt, imageSide } = block;
  if (!content?.length || !image) return null;

  const imageFirst = imageSide === "left";

  return (
    <section className="pb-[60px]">
      <div
        className={`container mx-auto px-4 xl:px-[40px] flex flex-col items-center gap-[60px] gap-x-[74px] md:grid md:grid-cols-[minmax(0,522px)_minmax(0,836px)] md:items-stretch ${
          imageFirst ? "flex-col-reverse" : ""
        }`}
      >
        {/* Image cell - first in DOM when imageSide left so it appears in first grid column */}
        {imageFirst && (
          <div className="relative w-full h-auto aspect-328/189 max-w-[522px] md:aspect-auto md:min-h-[320px] min-w-[328px] md:w-full md:min-w-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
                },
              }}
              className="relative w-full h-full min-h-[189px]"
            >
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                className="object-cover rounded-[8px]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 522px"
              />
            </motion.div>
          </div>
        )}
        {/* Text cell */}
        <div className="w-full min-w-0">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.4 },
              },
            }}
            className="text-[14px] lg:text-[18px] font-light leading-[130%] text-black"
          >
            <PortableTextRenderer value={content} />
          </motion.div>
        </div>
        {/* Image cell when image on right - after text in DOM so it appears in second grid column */}
        {!imageFirst && (
          <div className="relative w-full h-[232px] max-w-[836px] md:aspect-auto md:min-h-[317px] md:h-full md:min-w-0">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
                },
              }}
              className="relative w-full h-full"
            >
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                className="object-cover rounded-[8px] w-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 836px"
              />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

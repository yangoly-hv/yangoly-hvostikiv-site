"use client";

import * as motion from "motion/react-client";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import type { BlogPlainTextBlock as BlogPlainTextBlockType } from "@/shared/types/blog.types";

interface Props {
  block: BlogPlainTextBlockType;
}

export default function BlogPlainTextBlock({ block }: Props) {
  if (!block.content?.length) return null;

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
          className="w-full min-w-0"
        >
          <div className="text-[18px] font-light leading-[130%] text-black">
            <PortableTextRenderer value={block.content} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

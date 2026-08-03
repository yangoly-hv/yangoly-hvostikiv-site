"use client";

import type { BlogContentBlock } from "../model/types";
import BlogPlainTextBlock from "./BlogPlainTextBlock";
import BlogTextWithImageBlock from "./BlogTextWithImageBlock";
import BlogSingleImageBlock from "./BlogSingleImageBlock";
import BlogGalleryBlock from "./BlogGalleryBlock";

interface Props {
  blocks: BlogContentBlock[];
}

export default function BlogBlockContent({ blocks }: Props) {
  if (!blocks?.length) return null;

  return (
    <>
      {blocks.map((block) => {
        const key = block._key;
        switch (block._type) {
          case "blogPlainTextBlock":
            return (
              <BlogPlainTextBlock key={key} block={block} />
            );
          case "blogTextWithImageBlock":
            return (
              <BlogTextWithImageBlock key={key} block={block} />
            );
          case "blogSingleImageBlock":
            return (
              <BlogSingleImageBlock key={key} block={block} />
            );
          case "blogGalleryBlock":
            return (
              <BlogGalleryBlock key={key} block={block} />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

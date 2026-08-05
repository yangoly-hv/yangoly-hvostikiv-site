import Image from "next/image";
import type { BlogContentBlock } from "../model/types";
import BlogContentSection from "./BlogContentSection";

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
    <BlogContentSection className="relative mx-auto h-full min-h-[568px] w-full max-h-[568px] overflow-hidden rounded-[8px]">
      <Image
        src={image}
        alt={imageAlt ?? ""}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 898px"
      />
    </BlogContentSection>
  );
}

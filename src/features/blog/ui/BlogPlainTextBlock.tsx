import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import type { BlogContentBlock } from "../model/types";
import BlogContentSection from "./BlogContentSection";

type BlogPlainTextBlockType = Extract<
  BlogContentBlock,
  { _type: "blogPlainTextBlock" }
>;

interface Props {
  block: BlogPlainTextBlockType;
}

export default function BlogPlainTextBlock({ block }: Props) {
  if (!block.content?.length) return null;

  return (
    <BlogContentSection>
      <div className="text-[18px] font-light leading-[130%] text-black">
        <PortableTextRenderer value={block.content} />
      </div>
    </BlogContentSection>
  );
}

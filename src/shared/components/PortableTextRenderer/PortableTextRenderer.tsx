"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock, TypedObject } from "@portabletext/types";

interface PortableTextRendererProps {
  value: PortableTextBlock | Array<PortableTextBlock | TypedObject>;
  components?: PortableTextComponents;
}

export default function PortableTextRenderer({
  value,
  components,
}: PortableTextRendererProps) {
  if (!value) return null;

  return <PortableText value={value} components={components} />;
}

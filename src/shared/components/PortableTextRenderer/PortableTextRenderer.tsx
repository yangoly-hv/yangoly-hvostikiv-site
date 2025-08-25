"use client";

import { PortableText, PortableTextComponents } from "@portabletext/react";

interface PortableTextRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  components?: PortableTextComponents;
}

export default function PortableTextRenderer({
  value,
  components,
}: PortableTextRendererProps) {
  if (!value) return null;

  return <PortableText value={value} components={components} />;
}

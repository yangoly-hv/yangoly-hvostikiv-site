import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock, TypedObject } from "@portabletext/types";

import { getSafeHref, isExternalWebHref } from "@/shared/lib/safeHref";

interface PortableTextRendererProps {
  value: PortableTextBlock | Array<PortableTextBlock | TypedObject>;
  components?: PortableTextComponents;
}

export default function PortableTextRenderer({
  value,
  components,
}: PortableTextRendererProps) {
  if (!value) return null;

  const safeComponents: PortableTextComponents = {
    ...components,
    marks: {
      ...components?.marks,
      link: ({ value: linkValue, children }) => {
        const href = getSafeHref(linkValue?.href);
        if (!href) return <>{children}</>;

        const isExternal = isExternalWebHref(href);
        return (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
    },
  };

  return <PortableText value={value} components={safeComponents} />;
}

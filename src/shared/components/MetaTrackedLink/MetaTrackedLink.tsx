"use client";

import type { ComponentProps } from "react";

import { trackContactClick, trackMonoDonateClick } from "@/shared/lib/metaPixel";
import { getSafeHref } from "@/shared/lib/safeHref";

type MetaTrackedLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  event: "Contact" | "Donate";
};

export default function MetaTrackedLink({
  href,
  event,
  onClick,
  children,
  ...props
}: MetaTrackedLinkProps) {
  const safeHref = getSafeHref(href);
  if (!safeHref) return null;

  return (
    <a
      href={safeHref}
      {...props}
      onClick={(clickEvent) => {
        if (event === "Donate") trackMonoDonateClick();
        else trackContactClick();
        onClick?.(clickEvent);
      }}
    >
      {children}
    </a>
  );
}

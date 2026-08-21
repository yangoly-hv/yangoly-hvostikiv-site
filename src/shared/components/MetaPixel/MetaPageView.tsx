"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { trackPageViewAndReport } from "@/shared/lib/metaPixel";

export default function MetaPageView() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageViewAndReport();
  }, [pathname]);

  return null;
}

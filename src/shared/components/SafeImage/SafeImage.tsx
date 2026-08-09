"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

const isSvgSrc = (src: ImageProps["src"]) => {
  if (typeof src !== "string") return false;
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg");
};

type SafeImageProps = Omit<ImageProps, "onError" | "onLoad">;

const SafeImage = ({ src, alt, unoptimized, ...props }: SafeImageProps) => {
  const [forceUnoptimized, setForceUnoptimized] = useState(isSvgSrc(src));
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  const resolvedUnoptimized = Boolean(unoptimized || forceUnoptimized);

  const fallbackToDirect = () => {
    if (!resolvedUnoptimized) {
      setForceUnoptimized(true);
      return;
    }
    setFailed(true);
  };

  return (
    <Image
      {...props}
      key={resolvedUnoptimized ? "direct" : "optimized"}
      src={src}
      alt={alt}
      unoptimized={resolvedUnoptimized}
      onError={fallbackToDirect}
      onLoad={(event) => {
        // Optimizer can return a non-image body that still "loads" with 0×0.
        if (event.currentTarget.naturalWidth === 0) {
          fallbackToDirect();
        }
      }}
    />
  );
};

export default SafeImage;

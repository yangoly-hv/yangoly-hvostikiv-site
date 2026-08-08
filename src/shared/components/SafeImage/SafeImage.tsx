"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

const isSvgSrc = (src: ImageProps["src"]) => {
  if (typeof src !== "string") return false;
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg");
};

type SafeImageProps = Omit<ImageProps, "onError">;

const SafeImage = ({ src, unoptimized, ...props }: SafeImageProps) => {
  const [forceUnoptimized, setForceUnoptimized] = useState(isSvgSrc(src));
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  const resolvedUnoptimized = Boolean(unoptimized || forceUnoptimized);

  return (
    <Image
      {...props}
      key={resolvedUnoptimized ? "direct" : "optimized"}
      src={src}
      unoptimized={resolvedUnoptimized}
      onError={() => {
        if (!resolvedUnoptimized) {
          setForceUnoptimized(true);
          return;
        }
        setFailed(true);
      }}
    />
  );
};

export default SafeImage;

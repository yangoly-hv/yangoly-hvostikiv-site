export const getMetaPixelId = () =>
  typeof process.env.NEXT_PUBLIC_META_PIXEL_ID === "string"
    ? process.env.NEXT_PUBLIC_META_PIXEL_ID.trim()
    : "";

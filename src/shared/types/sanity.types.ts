export type SanityImage = {
  asset?: { _ref?: string };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
  url?: string;
  alt?: string;
};

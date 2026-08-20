import { imageUrlForSlot } from "@/shared/lib/sanityImage";
import type { SanityImage } from "@/shared/types/sanity.types";
import type { ReportDetail } from "./types";

export type ReportImageSource = SanityImage | string | null | undefined;

export type ReportDetailRecord = Omit<ReportDetail, "images"> & {
  images?: ReportImageSource[] | null;
};

export const mapReportImageUrl = (image: ReportImageSource) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return imageUrlForSlot(image, "reportSlider") || image.url || "";
};

export const mapReportImages = (images: ReportImageSource[] | null | undefined) => {
  if (!Array.isArray(images)) return [];
  return images.map(mapReportImageUrl).filter(Boolean);
};

export const normalizeReportDetail = (
  report: ReportDetailRecord | null
): ReportDetail | null => {
  if (!report) return null;
  return {
    ...report,
    images: mapReportImages(report.images),
  };
};

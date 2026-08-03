import type { PortableTextBlock } from "@portabletext/types";

export type ReportDate = { month: number; year: number };

export type ReportSummary = {
  _id: string;
  slug: string;
  date: ReportDate | string;
};

export type ReportDetail = ReportSummary & {
  title: string;
  images: string[];
  reportFileUrl?: string;
  reportFileName?: string;
  shortFoodDescription?: PortableTextBlock[];
  foodDescription?: PortableTextBlock[];
  shortHouseDescription?: PortableTextBlock[];
  houseDescription?: PortableTextBlock[];
  shortTherapyDescription?: PortableTextBlock[];
  therapyDescription?: PortableTextBlock[];
  shortOtherDescription?: PortableTextBlock[];
  otherDescription?: PortableTextBlock[];
};

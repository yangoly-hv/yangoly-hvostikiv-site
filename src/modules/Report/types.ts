import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";

import type { AppLocale } from "@/shared/config/site";
import type { ReportDetail } from "@/features/reports/model/types";

export type ReportTextField =
  | "foodDescription"
  | "houseDescription"
  | "therapyDescription"
  | "otherDescription";

export type ReportShortTextField =
  | "shortFoodDescription"
  | "shortHouseDescription"
  | "shortTherapyDescription"
  | "shortOtherDescription";

export type ReportTab = {
  id: "food" | "house" | "therapy" | "other";
  title: string;
  cta: string;
  description: PortableTextBlock[];
  iconSrc: string;
  field: ReportTextField;
  content: ReactNode;
};

export type ReportForView = ReportDetail & { date: string };

export type ReportTabConfig = {
  id: ReportTab["id"];
  labels: Record<AppLocale, Pick<ReportTab, "title" | "cta">>;
  iconSrc: string;
  shortField: ReportShortTextField;
  field: ReportTextField;
};

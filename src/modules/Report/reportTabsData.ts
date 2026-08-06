import type { PortableTextBlock } from "@portabletext/types";

import type { AppLocale } from "@/shared/config/site";
import type { ReportDetail } from "@/features/reports/model/types";

import type {
  ReportShortTextField,
  ReportTab,
  ReportTabConfig,
  ReportTextField,
} from "./types";

type ReportTextSource = Partial<
  Pick<ReportDetail, ReportShortTextField | ReportTextField>
>;

export const TAB_CONFIG = [
  {
    id: "food",
    labels: {
      uk: {
        title: "Допомога кормом",
        cta: "Детальніше про допомогу кормом",
      },
      en: {
        title: "Food assistance",
        cta: "More about food assistance",
      },
    },
    iconSrc: "/images/reports/food.svg",
    shortField: "shortFoodDescription",
    field: "foodDescription",
  },
  {
    id: "house",
    labels: {
      uk: {
        title: "Житло для хвостиків",
        cta: "Детальніше про житло для хвостиків",
      },
      en: {
        title: "Housing for tails",
        cta: "More about housing for tails",
      },
    },
    iconSrc: "/images/reports/house.svg",
    shortField: "shortHouseDescription",
    field: "houseDescription",
  },
  {
    id: "therapy",
    labels: {
      uk: {
        title: "Ветеринарна допомога",
        cta: "Детальніше про ветеринарну допомогу",
      },
      en: {
        title: "Veterinary care",
        cta: "More about veterinary care",
      },
    },
    iconSrc: "/images/reports/drug.svg",
    shortField: "shortTherapyDescription",
    field: "therapyDescription",
  },
  {
    id: "other",
    labels: {
      uk: {
        title: "Інше",
        cta: "Детальніше про іншу допомогу",
      },
      en: {
        title: "Other",
        cta: "More about other assistance",
      },
    },
    iconSrc: "/images/reports/other.svg",
    shortField: "shortOtherDescription",
    field: "otherDescription",
  },
] satisfies ReportTabConfig[];

export const getPortableTextText = (value?: PortableTextBlock[]) =>
  value
    ?.map(
      (block) =>
        block.children
          ?.map((child) => ("text" in child ? child.text : ""))
          .join("") || "",
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim() || "";

export const hasPortableTextContent = (value?: PortableTextBlock[]) =>
  Boolean(getPortableTextText(value));

const getTabLabels = (tab: ReportTabConfig, locale: AppLocale = "uk") =>
  tab.labels[locale] ?? tab.labels.uk;

export function buildReportTabsData(
  report: ReportTextSource,
  locale: AppLocale = "uk",
): Omit<ReportTab, "content">[] {
  return TAB_CONFIG.filter(
    (tab) =>
      hasPortableTextContent(report?.[tab.shortField]) &&
      hasPortableTextContent(report?.[tab.field]),
  ).map((tab) => ({
    ...getTabLabels(tab, locale),
    id: tab.id,
    description: report?.[tab.shortField] ?? [],
    iconSrc: tab.iconSrc,
    field: tab.field,
  }));
}

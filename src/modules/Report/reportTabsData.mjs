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
];

export const getPortableTextText = (value) =>
  value
    ?.map(
      (block) =>
        block.children?.map((child) => child.text || "").join("") || "",
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim() || "";

export const hasPortableTextContent = (value) =>
  Boolean(getPortableTextText(value));

export const getReportText = (report, tab) =>
  getPortableTextText(report?.[tab.shortField]);

const getTabLabels = (tab, locale = "uk") => tab.labels[locale] ?? tab.labels.uk;

export function buildReportTabsData(report, locale = "uk") {
  return TAB_CONFIG.filter(
    (tab) =>
      hasPortableTextContent(report?.[tab.shortField]) &&
      hasPortableTextContent(report?.[tab.field]),
  ).map((tab) => ({
    ...getTabLabels(tab, locale),
    id: tab.id,
    description: report?.[tab.shortField],
    iconSrc: tab.iconSrc,
    field: tab.field,
  }));
}

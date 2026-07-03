export const TAB_CONFIG = [
  {
    id: "food",
    title: "Допомога кормом",
    cta: "Детальніше про допомогу кормом",
    iconSrc: "/images/reports/food.svg",
    shortField: "shortFoodDescription",
    field: "foodDescription",
  },
  {
    id: "house",
    title: "Житло для хвостиків",
    cta: "Детальніше про житло для хвостиків",
    iconSrc: "/images/reports/house.svg",
    shortField: "shortHouseDescription",
    field: "houseDescription",
  },
  {
    id: "therapy",
    title: "Лікування хвостиків",
    cta: "Детальніше про лікування",
    iconSrc: "/images/reports/drug.svg",
    shortField: "shortTherapyDescription",
    field: "therapyDescription",
  },
  {
    id: "other",
    title: "Інше",
    cta: "Детальніше про іншу допомогу",
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

export function buildReportTabsData(report) {
  return TAB_CONFIG.filter(
    (tab) =>
      hasPortableTextContent(report?.[tab.shortField]) &&
      hasPortableTextContent(report?.[tab.field]),
  ).map((tab) => ({
    id: tab.id,
    title: tab.title,
    description: getReportText(report, tab),
    iconSrc: tab.iconSrc,
    cta: tab.cta,
    field: tab.field,
  }));
}

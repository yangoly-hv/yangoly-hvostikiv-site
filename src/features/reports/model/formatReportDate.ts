import type { AppLocale } from "@/shared/config/site";
import type { ReportDate } from "./types";

export const formatReportDate = (value: ReportDate, locale: AppLocale) => {
  if (!value?.month || !value?.year) return "";

  const date = new Date(value.year, value.month - 1, 1);
  const formatted = new Intl.DateTimeFormat(
    locale === "uk" ? "uk-UA" : "en-US",
    { month: "long", year: "numeric" }
  ).format(date);

  const normalized = locale === "uk" ? formatted.replace(/\s?р\.?$/, "") : formatted;
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

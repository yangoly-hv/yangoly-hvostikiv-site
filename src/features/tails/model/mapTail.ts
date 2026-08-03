import type { AppLocale } from "@/shared/config/site";
import type { TailDocument, TailViewModel } from "./types";

const getSterilizationText = (
  needsSterilization: boolean,
  sex: TailDocument["sex"],
  locale: AppLocale
) => {
  if (locale === "en") {
    return needsSterilization ? "Not sterilized" : "Sterilized";
  }

  if (needsSterilization) {
    return sex === "boy" ? "Нестерилізований" : "Нестерилізована";
  }

  return sex === "boy" ? "Стерилізований" : "Стерилізована";
};

export const mapTail = (
  tail: TailDocument,
  locale: AppLocale
): TailViewModel => {
  const needsSterilization = tail.needs_sterilization !== false;
  const additionalUrls = Array.isArray(tail.imageUrls) ? tail.imageUrls : [];
  const mainImageUrl = tail.mainImageUrl || "";

  return {
    id: tail._id,
    slug: tail.slug,
    image: mainImageUrl,
    cardImage: mainImageUrl,
    images: [mainImageUrl, ...additionalUrls].filter(Boolean),
    galleryImages: [mainImageUrl, ...additionalUrls].filter(Boolean),
    name: tail.name,
    description: tail.description || [],
    mainText: tail.description || [],
    sex:
      locale === "en"
        ? tail.sex === "boy"
          ? "Boy"
          : "Girl"
        : tail.sex === "boy"
          ? "Хлопчик"
          : "Дівчинка",
    sterilized: getSterilizationText(needsSterilization, tail.sex, locale),
    categories: [
      tail.needs_family ? "needs-family" : "adopted",
      ...(needsSterilization ? ["needs-sterilization"] : []),
    ],
    sterilization_price: tail.sterilization_price,
    keeping_price: tail.keeping_price,
  };
};

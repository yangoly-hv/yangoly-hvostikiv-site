export const allReportsQuery = `
  *[_type == "reports"] | order(date.year desc, date.month desc) {
    _id,
    date,
    "slug": slug.current
  }
`;

export const reportBySlugQuery = `
  *[_type == "reports" && slug.current == $slug][0] {
    _id,
    "title": title[$lang],
    date,
    "slug": slug.current,
    "images": coalesce(images[].asset->url, []),
    "reportFileUrl": reportFile.asset->url,
    "reportFileName": reportFile.asset->originalFilename,
    "shortFoodDescription": shortFoodDescription[$lang],
    "foodDescription": foodDescription[$lang],
    "shortHouseDescription": shortHouseDescription[$lang],
    "houseDescription": houseDescription[$lang],
    "shortTherapyDescription": shortTherapyDescription[$lang],
    "therapyDescription": therapyDescription[$lang],
    "shortOtherDescription": shortOtherDescription[$lang],
    "otherDescription": otherDescription[$lang]
  }
`;

export const allReportSlugsQuery = `
  *[_type == "reports" && defined(slug.current)][]{"slug": slug.current}
`;

export const performanceQuery = `
  *[_type == "perfomance"][0]{
    tailsCount,
    feedCount,
    vaccinesCount,
    treatmentsCount
  }
`;

export const topDonorsQuery = `
  *[_type == "donator" && (!defined(isActive) || isActive == true)] | order(amount desc)[0...5]{
    _id,
    "name": name[$lang],
    amount
  }
`;

export const mainCollectionQuery = `
  *[_type == "collection" && main == true][0]{
    _id,
    title,
    description,
    amount,
    amountCollected,
    monobankLongJarId,
    image{asset, crop, hotspot, "url": asset->url}
  }
`;

export const aboutFoundationQuery = `
  *[_type == "aboutFoundation"][0]{
    "title": title[$lang],
    "description": description[$lang],
    "imagesDesktop": imagesDesktop[].asset->url,
    "imagesMobile": imagesMobile[].asset->url
  }
`;

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

export const topDonorBoardQuery = `
  *[_type == "donator" && (!defined(isActive) || isActive == true)] | order(amount desc, _createdAt asc)[0...10]{
    _id,
    "kind": coalesce(donorKind, "person"),
    "name": coalesce(name[$lang], name.uk),
    amount,
    image{asset, crop, hotspot, "url": asset->url},
    instagramUrl,
    telegramUrl,
    websiteUrl
  }
`;

export const volunteersQuery = `
  *[_type == "volunteer"] | order(sortOrder asc, _updatedAt desc){
    _id,
    "name": coalesce(name[$lang], name.uk),
    "description": coalesce(description[$lang], description.uk),
    "contribution": coalesce(contribution[$lang], contribution.uk),
    photo{asset, crop, hotspot, "url": asset->url},
    instagramUrl,
    telegramUrl,
    facebookUrl
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

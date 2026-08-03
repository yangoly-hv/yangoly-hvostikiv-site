export const allTailsQuery = `
  *[_type == "tail"] | order(_createdAt desc) {
    _id,
    "name": name[$lang],
    "slug": slug.current,
    "description": description[$lang],
    sex,
    needs_sterilization,
    needs_family,
    "mainImage": mainImage{asset, crop, hotspot},
    "mainImageUrl": mainImage.asset->url,
    "images": images[]{asset, crop, hotspot},
    "imageUrls": images[].asset->url
  }
`;

export const tailBySlugQuery = `
  *[_type == "tail" && slug.current == $slug][0] {
    _id,
    "name": name[$lang],
    "slug": slug.current,
    "description": description[$lang],
    sex,
    needs_sterilization,
    sterilization_price,
    needs_family,
    keeping_price,
    "mainImage": mainImage{asset, crop, hotspot},
    "mainImageUrl": mainImage.asset->url,
    "images": images[]{asset, crop, hotspot},
    "imageUrls": images[].asset->url
  }
`;

export const allTailSlugsQuery = `
  *[_type == "tail" && defined(slug.current)][]{"slug": slug.current}
`;

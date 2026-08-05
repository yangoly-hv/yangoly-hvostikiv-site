export const allPostsQuery = `
  *[_type == "post" && defined(title[$lang]) && defined(slug.current)] | order(publishedAt desc, _updatedAt desc) {
    _id,
    "title": title[$lang],
    "slug": slug.current,
    "description": description[$lang],
    "mainImage": mainImage.asset->url,
    publishedAt,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    "title": title[$lang],
    "slug": slug.current,
    "description": description[$lang],
    "additionalInfo": additionalInfo[$lang],
    "mainImage": mainImage.asset->url,
    "secondaryImage": secondaryImage.asset->url,
    publishedAt,
    "createdAt": _createdAt,
    "updatedAt": _updatedAt,
    readingTime,
    "content": content[]{
      _key,
      _type,
      "content": content[$lang],
      "image": image.asset->url,
      "imageAlt": image.alt,
      imageSide,
      "images": images[]{"url": asset->url, "alt": alt}
    }
  }
`;

export const allPostSlugsQuery = `
  *[_type == "post" && defined(slug.current) && defined(title[$lang])]{"slug": slug.current, "updatedAt": _updatedAt}
`;

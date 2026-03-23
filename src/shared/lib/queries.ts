export const eventsQuery = `
  *[_type == "events" && _id == "events"][0]{
    title,
    "images": images[].asset->url
  }
`
export const allReportsQuery = `*[_type == "reports"] | order(publishedAt desc) {
  _id,
  "date": date[$lang],
  "slug": slug.current,
}`

export const reportBySlugQuery = `
  *[_type == "reports" && slug.current == $slug][0]{
  _id,
  "title": title[$lang],
  "date": date[$lang],
  "slug": slug.current,
  "images": images[].asset->url,
  "shortFoodDescription": shortFoodDescription[$lang],
  "foodDescription": foodDescription[$lang],
  "shortHouseDescription": shortHouseDescription[$lang],
  "houseDescription": houseDescription[$lang],
  "shortTherapyDescription": shortTherapyDescription[$lang],
  "therapyDescription": therapyDescription[$lang],
  "shortOtherDescription": shortOtherDescription[$lang],
  "otherDescription": otherDescription[$lang],
  }
`

export const allTailsQuery = `
  *[_type == "tail"]{
    _id,
    "name": name[$lang],
    "slug": slug.current,
    "description": description[$lang],
    sex,
    needs_sterilization,
    needs_family,
    "mainImage": mainImage.asset->url,
    "images": images[].asset->url
  }
`

export const tailBySlugQuery = `
    *[_type == "tail" && slug.current == $slug][0]{
    _id,
    "name": name[$lang],
    "slug": slug.current,
    "description": description[$lang],
    sex,
    needs_sterilization,
    sterilization_price,
    needs_family,
    keeping_price,
    "mainImage": mainImage.asset->url,
    "images": images[].asset->url
    }
`

export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc, _updatedAt desc){
    _id,
    "title": title[$lang],
    "slug": slug.current,
    "description": description[$lang],
    "mainImage": mainImage.asset->url,
    publishedAt
  }
`

export const topDotatorsQuery = `
  *[_type == "donator"] | order(amount desc) [0...5] {
    _id,
    "name": name[$lang],
    "amount": amount,
  }
`

export const postBySlugQuery = `
    *[_type == "post" && slug.current == $slug][0]{
    _id,
    "title": title[$lang],
    "slug": slug.current,
    "description": description[$lang],
    "additionalInfo": additionalInfo[$lang],
    "mainImage": mainImage.asset->url,
    "secondaryImage": secondaryImage.asset->url,
    }
`

/**
 * Post by slug with full content blocks (new schema).
 * Params: { slug: string, lang: "uk" | "en" }
 * Fetches every block field for all content items; blocks without a field get null.
 */
export const postBySlugWithContentQuery = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    "title": title[$lang],
    "slug": slug.current,
    "description": description[$lang],
    "additionalInfo": additionalInfo[$lang],
    "mainImage": mainImage.asset->url,
    "secondaryImage": secondaryImage.asset->url,
    publishedAt,
    readingTime,
    "content": content[]{
      _key,
      _type,
      "content": content[$lang],
      "image": image.asset->url,
      "imageAlt": image.alt,
      imageSide,
      "images": images[]{
        "url": asset->url,
        "alt": alt
      }
    }
  }
`
export const perfomanceQuery = `*[_type == "perfomance"][0]{
  tailsCount,
  feedCount,
  vaccinesCount,
  treatmentsCount,
}`

export const mainCollectionQuery = `*[_type == "collection" && main == true]{
 ...,
  image{
    ...,
    "url": asset->url
  }
}`;

export const aboutFoundationQuery = `*[_type == "aboutFoundation"][0]{
  "title": title[$lang],
  "description": description[$lang],
  "imagesDesktop": imagesDesktop[].asset->url,
  "imagesMobile": imagesMobile[].asset->url,
}`


export const eventsQuery = `
  *[_type == "events" && _id == "events"][0]{
    title,
    "images": images[].asset->url
  }
`
export const allReportsQuery = `*[_type == "report"] | order(publishedAt desc) {
  _id,
  "slug": slug.current,
  date,
}`

export const reportBySlugQuery = `
  *[_type == "report" && slug.current == $slug][0]{
    "title": title[$lang],
    "slug": slug.current,
    "date": date[$lang],
    link,
    "description": description[$lang],
    "additionalInfo": additionalInfo[$lang],
    "mainImage": mainImage.asset->url,
    "secondaryImage": secondaryImage.asset->url
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
  *[_type == "post"]{
    _id,
    "title": title[$lang],
    "slug": slug.current,
    "description": description[$lang],
    "mainImage": mainImage.asset->url
  }
`

export const topDotatorsQuery = `
  *[_type == "donator"]{
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

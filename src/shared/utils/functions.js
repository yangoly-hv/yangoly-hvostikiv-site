import * as cheerio from 'cheerio';

export function extractFirstParagraphText(html) {
    const $ = cheerio.load(html);
    let text = $('p').first().text().trim();

    if (text.length > 150) {
        let truncated = text.slice(0, 150);
        let lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) {
            truncated = truncated.slice(0, lastSpace);
        }
        return truncated;
    }

    return text;
}

export function extractTextFromHTML(htmlString) {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
}

export function extractParagraphs(htmlString) {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return Array.from(doc.querySelectorAll("p")).map(p => p.textContent.trim());
}

export const getSterializedText = ({needs_sterilization, sex, locale}) => {
    if(locale === "en") {
        return needs_sterilization ? "Not sterilized": "Sterilized";
    }
    if(locale === "uk") {
        if(needs_sterilization) {
            return sex === "boy" ? "Нестерилізований" : "Нестерилізована"
        }
        return sex === "boy" ? "Cтерилізований" : "Cтерилізована"
    }
}

//@ts-expect-error
export const getAnimalCategories = ({needs_family, needs_sterilization}) => {
    const categories = [];
    if(needs_family) {
        categories.push("needs-family");
    }
    else categories.push("adopted");

    if(needs_sterilization) categories.push("needs-sterilization");
    return categories;
}

export const getSexTranslation = (sex, locale) => {
    if(locale === "en") {
        return sex === "boy" ? "Boy" : "Girl";
    }
    return sex === "boy" ? "Хлопчик" : "Дівчина";
}

export const getDateFromISO = (date) => new Date(date).toLocaleDateString("ru-RU");

// export const getTailData = ({documentId, sex, images, name, description, needs_family, needs_sterilization}, lang) => ({
//     id: documentId,
//     image: images.length ? images[0]?.url : "",
//     //@ts-expect-error
//     images: images.map(img => img?.url),
//     name,
//     sex: getSexTranslation(sex, lang),
//     sterilized: getSterializedText({needs_sterilization, sex, locale: lang}),
//     categories: getAnimalCategories({needs_sterilization, needs_family}),
//     description: extractParagraphs(description),
//     mainText: description,
// });

export const getTailData = ({_id, slug, mainImage, images, sex, name, description, sterilization_price, keeping_price, needs_family, needs_sterilization}, lang) => ({
    id: _id,
    image: mainImage,
    slug: slug,
    images: [mainImage, ...images],
    name,
    sterilization_price,
    keeping_price,
    sex: getSexTranslation(sex, lang),
    sterilized: getSterializedText({needs_sterilization, sex, locale: lang}),
    categories: getAnimalCategories({needs_sterilization, needs_family}),
    description: description,
    mainText: description,
});

export const getBlogItemData = ({_id, slug, createdAt, title, description, additionalInfo, mainImage, secondaryImage})=> ({
    id: _id,
    slug,
    date: getDateFromISO(createdAt),
    title,
    description: description,
    mainText: description,
    mainPhoto: mainImage,
    secondaryPhoto: secondaryImage,
    mainPart: additionalInfo,
})

export const getReportData = ({date, title, description, mainPhoto, secondaryPhoto, mainPart, link})=> ({
    date,
    title,
    description,
    mainPhoto: mainPhoto?.url,
    secondaryPhoto: secondaryPhoto?.url,
    mainPart,
    link,
})

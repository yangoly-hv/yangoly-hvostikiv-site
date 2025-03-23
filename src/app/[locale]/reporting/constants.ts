const reporting = {
  uk: [
    {
      date: "Вересень 2024",
      title: "Звітність за фінанси та гуманітарну допомогу",
      description:
        "У світі багато тварин, які потребують турботи, і наша команда не може залишатися осторонь. Ми віримо, що кожен безпритульний песик заслуговує на тепло, захист і шанс знайти люблячий дім. Саме тому наш фонд активно допомагає притулкам, забезпечуючи їжею, медичною допомогою та підтримкою.",
      mainPart: [
        "🐕Роздали 800 кілограмів корму тварин у прифронтових областях.",
        "🐷226 домашніх, свійських і диких тварин евакуювали з прикордоння.",
        "🐎Закрили збір на допомогу коням у притулку “Пегас” завдяки вашим донатам і половину суми усього збору від Humane Society International.",
        "🐈Понад 302 тисячі гривень витратили на будівництво вольєрів для тварин у трьох притулках.",
        "🐕‍🦺3 тисячі 847 кілограмів корму відправили тварин у прифронтових областях.",
        "🐱100 котів і собак стерилізували.",
        "🐽Прибрали в 11 притулках для тварин у 8 областях України завдяки 75 волонтерам і волонтеркам. Пишаємося!",
        "💵Загалом на допомогу тваринам витратили 7 мільйонів 727 тисяч 715 гривень.",
        "📌Детальніше про допомогу тваринам у серпні:",
        "🐾Закрили збір на допомогу коням у притулку “Пегас” завдяки вашим донатам і половині суми усього збору від Humane Society International.",
        "🐾Отримали 14 тонн корму від House of Animals, який відправимо тваринам у прифронтових областях.",
        "🐾Провели прямий ефір про зміни клімату внаслідок війни з Ленардом де Клерк та розповіли трохи більше про те, як росія нищить не лише природу України, але й зазіхає на весь світ.",
        "🐾Прибрали в 11 притулках для тварин у 8 областях України — долучилися 75 чудових людей з друзями і сім’ями.",
        "🐾Роздали 800 кілограмів корму тваринам у прифронтових областях:",
        "– у чорнобаївці та Східному на Херсонщині;",
      ],
      mainPhoto: "/images/blog/mainPhoto.jpg",
      secondaryPhoto: "/images/blog/secondaryPhoto.jpg",
    },
  ],
  en: [
    {
      date: "September 2024",
      title: "Financial and Humanitarian Aid Report",
      description:
        "There are many animals in the world that need care, and our team cannot stay aside. We believe that every stray dog deserves warmth, protection, and a chance to find a loving home. That is why our foundation actively helps shelters by providing food, medical assistance, and support.",
      mainPart: [
        "🐕 Distributed 800 kilograms of pet food in frontline regions.",
        "🐷 Evacuated 226 domestic, farm, and wild animals from the border areas.",
        "🐎 Completed fundraising to support horses in the 'Pegasus' shelter thanks to your donations and half of the total amount covered by Humane Society International.",
        "🐈 Spent over 302 thousand UAH on building enclosures for animals in three shelters.",
        "🐕‍🦺 Sent 3,847 kilograms of pet food to animals in frontline regions.",
        "🐱 Sterilized 100 cats and dogs.",
        "🐽 Cleaned 11 animal shelters in 8 regions of Ukraine with the help of 75 volunteers. Proud of this!",
        "💵 A total of 7,727,715 UAH was spent on animal aid.",
        "📌 More details about animal aid in August:",
        "🐾 Completed fundraising to support horses in the 'Pegasus' shelter thanks to your donations and half of the total amount covered by Humane Society International.",
        "🐾 Received 14 tons of pet food from House of Animals, which will be sent to animals in frontline regions.",
        "🐾 Hosted a live broadcast on climate change due to war with Lennard de Klerk and shared more about how Russia is not only destroying Ukraine's nature but also endangering the world.",
        "🐾 Cleaned 11 animal shelters in 8 regions of Ukraine — 75 amazing people joined with their friends and families.",
        "🐾 Distributed 800 kilograms of pet food to animals in frontline regions:",
        "– in Chornobaivka and Skhidne in the Kherson region;",
      ],
      mainPhoto: "/images/blog/mainPhoto.jpg",
      secondaryPhoto: "/images/blog/secondaryPhoto.jpg",
    },
  ],
};

const reportingListUk = Array.from({ length: 50 }, (_, i) => ({
  ...reporting.uk[i % reporting.uk.length],
  id: `article-${i + 1}`,
}));

const reportingListEn = Array.from({ length: 50 }, (_, i) => ({
  ...reporting.en[i % reporting.en.length],
  id: `article-${i + 1}`,
}));

export const reportingList = { uk: reportingListUk, en: reportingListEn };

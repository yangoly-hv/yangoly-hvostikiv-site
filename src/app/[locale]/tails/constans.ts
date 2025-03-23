const baseTails = {
  uk: [
    {
      image: "/images/card-image.jpg",
      images: [
        "/images/card-image.jpg",
        "/images/rubi.jpg",
        "/images/juja.jpg",
        "/images/card-image.jpg",
      ],
      name: "Песик-інвалід Чарлі",
      sex: "Хлопчик",
      sterilized: "Нестерилізований",
      categories: ["needs-sterilization", "needs-family"],
      description: [
        "Чарлі отримав кулю в хребет та довго лежав на сонці, що призвело до інсульту. Також у песика паралізований сечовий міхур. Нажаль ходити він більше не зможе. Не дивлячись на це Чарлі дуже життєрадісний пес. У серпні 2024 року Чарлі був евакуйований з Покровська у Черкаську обл.",
        "Ставай янголом-патронусом для цього дивовижного хвостика.",
      ],
    },
    {
      image: "/images/rubi.jpg",
      images: [
        "/images/rubi.jpg",
        "/images/card-image.jpg",
        "/images/juja.jpg",
        "/images/rubi.jpg",
      ],
      name: "Кошеня Рубі",
      sex: "Дівчинка",
      sterilized: "Стерилізована",
      categories: ["needs-family"],
      description: [
        "Рубі – маленьке грайливе кошеня, яке шукає люблячу родину.",
        "Вона ніжна, ласкава і завжди рада новим друзям.",
      ],
    },
    {
      image: "/images/juja.jpg",
      images: [
        "/images/juja.jpg",
        "/images/card-image.jpg",
        "/images/rubi.jpg",
        "/images/juja.jpg",
      ],
      name: "Жужа",
      sex: "Дівчинка",
      sterilized: "Стерилізована",
      categories: ["needs-family", "adopted"],
      description: [
        "Жужа – активна та енергійна собачка, яка любить гратися і гуляти.",
        "Вона стане чудовим другом для всієї родини.",
      ],
    },
    {
      image: "/images/card-image.jpg",
      images: [
        "/images/card-image.jpg",
        "/images/juja.jpg",
        "/images/rubi.jpg",
        "/images/card-image.jpg",
      ],
      name: "Барсік",
      sex: "Хлопчик",
      sterilized: "Нестерилізований",
      categories: ["needs-sterilization"],
      description: [
        "Барсік – добрий і спокійний кіт, який обожнює муркотіти та ніжитися на сонечку.",
      ],
    },
    {
      image: "/images/rubi.jpg",
      images: [
        "/images/rubi.jpg",
        "/images/card-image.jpg",
        "/images/juja.jpg",
        "/images/rubi.jpg",
      ],
      name: "Мурзик",
      sex: "Хлопчик",
      sterilized: "Стерилізований",
      categories: ["needs-family"],
      description: [
        "Мурзик – грайливий котик, який шукає дім, де його любитимуть та піклуватимуться про нього.",
      ],
    },
    {
      image: "/images/juja.jpg",
      images: [
        "/images/juja.jpg",
        "/images/rubi.jpg",
        "/images/card-image.jpg",
        "/images/juja.jpg",
      ],
      name: "Граф",
      sex: "Хлопчик",
      sterilized: "Стерилізований",
      categories: ["adopted"],
      description: [
        "Граф – благородний і відданий пес, який мріє про дім, де його оточать турботою та любов'ю.",
      ],
    },
  ],
  en: [
    {
      image: "/images/card-image.jpg",
      images: [
        "/images/card-image.jpg",
        "/images/rubi.jpg",
        "/images/juja.jpg",
        "/images/card-image.jpg",
      ],
      name: "Charlie the Disabled Dog",
      sex: "Boy",
      sterilized: "Not sterilized",
      categories: ["needs-sterilization", "needs-family"],
      description: [
        "Charlie was shot in the spine and lay in the sun for a long time, which led to a stroke. He also has a paralyzed bladder. Unfortunately, he will never walk again. Despite this, Charlie is a very cheerful dog. In August 2024, Charlie was evacuated from Pokrovsk to the Cherkasy region.",
        "Become a guardian angel for this amazing pup.",
      ],
    },
    {
      image: "/images/rubi.jpg",
      images: [
        "/images/rubi.jpg",
        "/images/card-image.jpg",
        "/images/juja.jpg",
        "/images/rubi.jpg",
      ],
      name: "Ruby the Kitten",
      sex: "Girl",
      sterilized: "Sterilized",
      categories: ["needs-family"],
      description: [
        "Ruby is a small, playful kitten looking for a loving family.",
        "She is gentle, affectionate, and always happy to meet new friends.",
      ],
    },
    {
      image: "/images/juja.jpg",
      images: [
        "/images/juja.jpg",
        "/images/card-image.jpg",
        "/images/rubi.jpg",
        "/images/juja.jpg",
      ],
      name: "Juja",
      sex: "Girl",
      sterilized: "Sterilized",
      categories: ["needs-family", "adopted"],
      description: [
        "Juja is an active and energetic dog who loves to play and go for walks.",
        "She will be a wonderful friend for the whole family.",
      ],
    },
    {
      image: "/images/card-image.jpg",
      images: [
        "/images/card-image.jpg",
        "/images/juja.jpg",
        "/images/rubi.jpg",
        "/images/card-image.jpg",
      ],
      name: "Barsik",
      sex: "Boy",
      sterilized: "Not sterilized",
      categories: ["needs-sterilization"],
      description: [
        "Barsik is a kind and calm cat who loves to purr and bask in the sun.",
      ],
    },
    {
      image: "/images/rubi.jpg",
      images: [
        "/images/rubi.jpg",
        "/images/card-image.jpg",
        "/images/juja.jpg",
        "/images/rubi.jpg",
      ],
      name: "Murzik",
      sex: "Boy",
      sterilized: "Sterilized",
      categories: ["needs-family"],
      description: [
        "Murzik is a playful cat looking for a home where he will be loved and cared for.",
      ],
    },
    {
      image: "/images/juja.jpg",
      images: [
        "/images/juja.jpg",
        "/images/rubi.jpg",
        "/images/card-image.jpg",
        "/images/juja.jpg",
      ],
      name: "Graf",
      sex: "Boy",
      sterilized: "Sterilized",
      categories: ["adopted"],
      description: [
        "Graf is a noble and loyal dog who dreams of a home where he will be surrounded by care and love.",
      ],
    },
  ],
};

const tailsUk = Array.from({ length: 100 }, (_, i) => ({
  ...baseTails.uk[i % baseTails.uk.length],
  id: `tail-${i + 1}`,
  name: `${baseTails.uk[i % baseTails.uk.length].name} #${i + 1}`,
}));

const tailsEn = Array.from({ length: 100 }, (_, i) => ({
  ...baseTails.en[i % baseTails.en.length],
  id: `tail-${i + 1}`,
  name: `${baseTails.en[i % baseTails.en.length].name} #${i + 1}`,
}));

export const tails = { uk: tailsUk, en: tailsEn };

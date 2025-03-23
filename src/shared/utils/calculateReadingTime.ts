import { INewsItem } from "../types";

export const calculateReadingTime = (
  article: INewsItem,
  wordsPerMinute: number = 200
): number => {
  // Функція для підрахунку слів у тексті
  const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

  // Підрахунок слів у всіх текстових полях
  let totalWords =
    countWords(article.title) +
    countWords(article.description) +
    countWords(article.mainPart.text);

  // Підрахунок слів у списках
  article.mainPart.lists.forEach((list) => {
    totalWords += countWords(list.title);
    list.items.forEach((item: string) => {
      totalWords += countWords(item);
    });
  });

  // Розрахунок часу читання у хвилинах
  return Math.ceil(totalWords / wordsPerMinute);
};

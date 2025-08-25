"use client";
import TailCard from "../TailCard/TailCard";
import { IRandomTailCardsProps } from "@/shared/types";

const RandomTailCards = ({ tails, translation }: IRandomTailCardsProps) => {
  // зробимо масив довжиною 10, дублюючи картки
  const duplicatedTails = Array(10)
    .fill(null)
    .map((_, i) => tails[i % tails.length]); // якщо карток менше, воно крутиться по колу

  return (
    <div className="w-full">
      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 laptop:grid-cols-4 gap-5 mt-6 pb-[120px]">
        {duplicatedTails.map((randomTail, index) => (
          <TailCard key={index} tail={randomTail} translation={translation} />
        ))}
      </ul>
    </div>
  );
};

export default RandomTailCards;

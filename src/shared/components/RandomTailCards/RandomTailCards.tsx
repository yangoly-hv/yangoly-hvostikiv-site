"use client";
import TailCard from "../TailCard/TailCard";
import { useRandomCardsPerPage } from "@/shared/hooks/useRandomCardsPerPage";
import { IRandomTailCardsProps } from "@/shared/types";

const RandomTailCards = ({ tails, translation }: IRandomTailCardsProps) => {
  const itemsToShow = useRandomCardsPerPage();
  return (
    <div className="flex justify-center">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 laptop:grid-cols-4 gap-5 mt-6 pb-[120px]">
        {tails.slice(0, itemsToShow).map((randomTail, index) => (
          <TailCard key={index} tail={randomTail} translation={translation} />
        ))}
      </ul>
    </div>
  );
};

export default RandomTailCards;

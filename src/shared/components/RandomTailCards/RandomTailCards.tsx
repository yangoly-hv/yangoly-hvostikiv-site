"use client";
import { useRandomCardsPerPage } from "@/shared/hooks/useRandomCardsPerPage";
import TailCard from "../TailCard/TailCard";
import { IRandomTailCardsProps } from "@/shared/types";

const RandomTailCards = ({ tails, translation }: IRandomTailCardsProps) => {
  const itemsToShow = useRandomCardsPerPage();

  return (
    <div className="w-full">
      <ul className="w-full flex flex-wrap gap-5 mt-6 pb-[120px]">
        {tails.slice(0, itemsToShow).map((randomTail, index) => (
          <li
            key={index}
            className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33%-13.33px)] laptop:w-[calc(25%-15px)]"
          >
            <TailCard tail={randomTail} translation={translation} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RandomTailCards;

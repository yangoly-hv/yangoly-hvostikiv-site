import type { ITails } from "@/shared/types";
import type { TailViewModel } from "../model/types";
import TailCard from "./TailCard";

const RandomTailCards = ({
  tails,
  translation,
}: {
  tails: TailViewModel[];
  translation: ITails;
}) => (
  <div className="w-full">
    <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 laptop:grid-cols-4 gap-5 mt-6 pb-[120px]">
      {tails.map((tail) => (
        <li key={tail.id}>
          <TailCard tail={tail} translation={translation} />
        </li>
      ))}
    </ul>
  </div>
);

export default RandomTailCards;

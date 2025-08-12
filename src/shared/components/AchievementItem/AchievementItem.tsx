import { IWorkResult } from "@/shared/types";

const AchievementItem = ({ amount, name }: IWorkResult) => {
  return (
    <div className="w-[197px]    flex flex-col justify-center items-center gap-[6px]">
      <p className="text-[48px] numeric-font leading-[130%] text-orange font-extralight font-arial ">
        {amount}
      </p>
      <p className="text-[18px] text-orange uppercase font-medium text-center  leading-[130%]">
        {name}
      </p>
    </div>
  );
};

export default AchievementItem;

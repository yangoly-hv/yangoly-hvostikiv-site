import { IWorkResult } from "@/shared/types";

const AchievementItem = ({ amount, name }: IWorkResult) => {
  return (
    <div className="w-full md:w-auto md:flex-1 md:max-w-[197px] flex flex-col justify-center items-center gap-[6px]">
      <p className="text-[32px] md:text-[40px] xl:text-[48px] numeric-font leading-[110%] text-orange font-extralight font-arial">
        {amount}
      </p>
      <p className="text-[12px] md:text-[16px] xl:text-[18px] text-orange uppercase font-medium text-center leading-[130%]">
        {name}
      </p>
    </div>
  );
};

export default AchievementItem;

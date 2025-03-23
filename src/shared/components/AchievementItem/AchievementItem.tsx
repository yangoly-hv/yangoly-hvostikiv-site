import { IWorkResult } from "@/shared/types";

const AchievementItem = ({ count, action }: IWorkResult) => {
  return (
    <div className="w-[197px]    flex flex-col justify-center items-center gap-[6px]">
      <p className="text-[48px] numeric-font leading-[130%] text-orange font-extralight font-arial ">
        {count}
      </p>
      <p className="text-[18px] text-orange uppercase font-medium text-center  leading-[130%]">
        {action}
      </p>
    </div>
  );
};

export default AchievementItem;

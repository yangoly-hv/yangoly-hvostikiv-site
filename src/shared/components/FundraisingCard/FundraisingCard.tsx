"use client";
import Image from "next/image";
import ProgressBar from "../ProgressBar/ProgressBar";
import { formatAmount } from "@/shared/utils";
import Button from "../Button/Button";
import { IFundraisingCardProps } from "@/shared/types";
import clsx from "clsx";

const FundraisingCard = ({
  image,
  title,
  totalAmount,
  currentAmount,
  currency,
  buttonText,
  onClick,
  className,
  goal,
}: IFundraisingCardProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col justify-between card-shadow py-[32px] px-[20px] bg-[#FCFCFC] rounded-[20px]",
        className
      )}
    >
      <div className="relative w-full aspect-[321/281] rounded-[16px]">
        <Image
          src={image}
          alt="Photo"
          fill
          className="object-cover rounded-[16px]"
          sizes="(max-width: 1280px) 50vw, 33vw"
        />
      </div>
      <h2 className="text-black text-[24px] xl:text-[28px] text-center font-semibold leading-[130%] mt-[20px]">
        {title}
      </h2>
      <div className="flex justify-between mt-[18px] mb-[16px]">
        <p className="text-black text-[18px] font-semibold leading-[130%]">
          {goal}
        </p>
        <p className="text-black text-[18px] font-semibold leading-[130%]">
          {formatAmount(totalAmount)} {currency}
        </p>
      </div>
      <ProgressBar totalAmount={totalAmount} currentAmount={currentAmount} />
      <Button
        className="w-full mt-[20px]"
        text={buttonText}
        onClick={onClick}
        variant="secondary"
      />
    </div>
  );
};

export default FundraisingCard;

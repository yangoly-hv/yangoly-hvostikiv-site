import Image from "next/image";
import ProgressBar from "../ProgressBar/ProgressBar";
import { ICardProps } from "@/shared/types";
import Button from "../Button/Button";
import { cn } from "@/shared/utils";

const Card = ({
  title,
  withProgressBar = false,
  goal,
  currency,
  currentAmount,
  totalAmount,
  onClick,
  buttonText,
  image,
  buttonStyle,
  ...props
}: ICardProps) => {
  return (
    <div
      {...props}
      className={cn(
        "bg-white p-5 rounded-[16px] flex flex-col gap-4 card-shadow",
        !withProgressBar && "p-0"
      )}
    >
      {title && (
        <h3 className="text-center text-black text-[24px] leading-[130%]">
          {title}
        </h3>
      )}
      <div className="relative w-full aspect-[321/281] rounded-[16px]">
        <Image
          src={image}
          alt="Photo"
          fill
          className="object-cover rounded-[16px]"
          sizes="(max-width: 1280px) 50vw, 33vw"
        />
      </div>

      {withProgressBar && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-black leading-[130%]">{goal}</p>
            <p className="text-black leading-[130%] numeric-font">
              {totalAmount} {currency}
            </p>
          </div>
          <ProgressBar
            totalAmount={totalAmount!}
            currentAmount={currentAmount!}
          />
        </div>
      )}

      {buttonText && (
        <Button
          className={cn("py-3", buttonStyle)}
          onClick={onClick}
          text={buttonText!}
        />
      )}
    </div>
  );
};

export default Card;

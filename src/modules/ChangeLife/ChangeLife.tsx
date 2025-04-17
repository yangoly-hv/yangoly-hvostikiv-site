import { IChangeLifeProps } from "@/shared/types";
import Button from "@/shared/components/Button/Button";
import Image from "next/image";

export default function ChangeLife({ translation }: IChangeLifeProps) {
  const { title, description, becomePartner, joinVolunteers } = translation;

  return (
    <section className="relative mt-[131px] mb-[100px] xl:my-[140px] bg-white">
      <div className="absolute z-10 bottom-[148px] sm:bottom-[96px] left-[calc(50%-288px)] h-[196px] w-[577px]">
        <Image
          src="/images/home/changeLife/greenEllipse.webp"
          alt="background"
          width="1154"
          height="392"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container px-4 xl:px-10 mx-auto py-6 xl:py-[89px]">
        <h2 className="mb-2 md:mb-4 text-center uppercase font-arial text-[18px] xl:text-[32px] leading-[127%]">
          {title}
        </h2>
        <p className="mb-[235px] text-[12px] xl:text-[18px] leading-[130%] text-center">
          {description}
        </p>

        <Image
          src="/images/home/changeLife/dogs.webp"
          alt="dogs"
          width={1460}
          height={1040}
          className="absolute z-20 bottom-[120px] sm:bottom-[68px] left-[calc(50%-169px)] w-[338px] h-auto"
        />
        <div className="flex flex-col sm:flex-row gap-x-5 md:flex-col gap-y-3 xl:gap-y-6 ">
          {" "}
          <Button className="w-full" text={becomePartner} />
          <Button className="w-full" variant="orange" text={joinVolunteers} />
        </div>
      </div>
    </section>
  );
}

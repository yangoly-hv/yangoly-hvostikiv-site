import Image from "next/image";
import { IChangeLifeProps } from "@/shared/types";
import Button from "@/shared/components/Button/Button";
import ChangeLifeImagesMob from "./ChangeLifeImagesMob";

export default function ChangeLife({ translation }: IChangeLifeProps) {
  const { title, description, becomePartner, joinVolunteers } = translation;

  return (
    <section className="relative mt-[131px] mb-[100px] xl:my-[140px] bg-white md:bg-transparent overflow-hidden">
      <ChangeLifeImagesMob />
      <div className="container px-4 xl:px-10 mx-auto">
        <div className="relative py-6 md:py-[89px] md:bg-white md:rounded-[8px] overflow-hidden">
          <div className="hidden md:block absolute z-20 top-[-50px] left-[-40px] xl:left-[-50px] md:h-[509px] xl:h-[634px] aspect-[854/634]">
            <Image
              src="/images/home/changeLife/pawsDesk.svg"
              alt="paws"
              width="854"
              height="634"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="hidden md:block absolute z-10 md:bottom-0 md:right-[-320px] lg:right-[-90px] xl:right-[-60px] desk:right-0 
          aspect-[577/196] md:h-[409px] xl:h-[529px] desk:h-[649px]"
          >
            <Image
              src="/images/home/changeLife/greenEllipseDesk.svg"
              alt="background"
              width="1433"
              height="520"
              className="w-full h-full object-cover"
            />
          </div>
          <Image
            src="/images/home/changeLife/dogs.webp"
            alt="dogs"
            width={1460}
            height={1040}
            className="hidden md:block absolute z-20 md:bottom-[48px] lg:bottom-[-30px] xl:bottom-[-38px] md:right-0 xl:right-[-30px] desk:right-10 md:w-[338px] 
            lg:w-[518px] xl:w-[763px] h-auto"
          />
          <div className=" md:pl-[87px]">
            <h2 className="md:w-[363px] laptop:w-[463px] mb-2 md:mb-4 text-center md:text-left uppercase font-arial text-[18px] xl:text-[32px] leading-[127%] laptop:leading-[140%]">
              {title}
            </h2>
            <p className="md:w-[363px] laptop:w-[515px] mb-[235px] md:mb-8 text-[12px] xl:text-[18px] leading-[130%] text-center md:text-left">
              {description}
            </p>
            <div className="md:w-[323px] laptop:w-[463px] desk:w-[523px] flex flex-col sm:flex-row gap-x-5 md:flex-col gap-y-3 xl:gap-y-6 ">
              <Button className="w-full laptop:h-[67px]" text={becomePartner} />
              <Button
                className="w-full laptop:h-[67px]"
                variant="orange"
                text={joinVolunteers}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

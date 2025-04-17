import { IChangeLifeProps } from "@/shared/types";
import Button from "@/shared/components/Button/Button";
import ChangeLifeImagesMob from "./ChangeLifeImagesMob";
import ChangeLifeImagesDesk from "./ChangeLifeImagesDesk";
import Link from "next/link";

export default function ChangeLife({ translation }: IChangeLifeProps) {
  const { title, description, becomePartner, joinVolunteers } = translation;

  return (
    <section className="relative mt-[131px] mb-[100px] xl:my-[140px] bg-white md:bg-transparent overflow-hidden">
      <ChangeLifeImagesMob />
      <div className="container px-4 xl:px-10 mx-auto">
        <div className="relative z-20 py-6 md:py-[89px] md:bg-white md:rounded-[8px] overflow-hidden">
          <ChangeLifeImagesDesk />
          <div className=" md:pl-[87px]">
            <h2 className="md:w-[363px] laptop:w-[463px] mb-2 md:mb-4 text-center md:text-left uppercase font-arial text-[18px] xl:text-[32px] leading-[127%] laptop:leading-[140%]">
              {title}
            </h2>
            <p className="md:w-[363px] laptop:w-[515px] mb-[235px] md:mb-8 text-[12px] xl:text-[18px] leading-[130%] text-center md:text-left">
              {description}
            </p>
            <div className="md:w-[323px] laptop:w-[463px] desk:w-[523px] flex flex-col sm:flex-row gap-x-5 md:flex-col gap-y-3 xl:gap-y-6 ">
              <Link href="/partnership">
                <Button
                  className="w-full laptop:h-[67px]"
                  text={becomePartner}
                />
              </Link>
              <Link href="/volunteering">
                <Button
                  className="w-full laptop:h-[67px]"
                  variant="orange"
                  text={joinVolunteers}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Button from "@/shared/components/Button/Button";
import AngelsList from "./AngelsList";
import { IAngelsMobProps } from "@/shared/types";

export default function AngelsMob({ translation, lang }: IAngelsMobProps) {
  const { title, makeContribution } = translation;

  return (
    <div className="md:hidden flex flex-col gap-y-10">
      <div className="relative bg-white pt-[33px] pb-[87px] overflow-hidden">
        <Image
          src="/images/home/angels/dog.webp"
          alt="dog"
          width={905}
          height={934}
          className="absolute bottom-0 left-[calc(50%-180px)] w-[211px] h-auto"
        />
        <div className="container px-4 xl:px-10 mx-auto">
          <h2 className="max-w-[152px] ml-[calc(50%+31px)] font-arial text-[14px] xl:text-[24px] leading-[157%] xl:leading-[142px] uppercase">
            {title}
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-y-10 container px-4 xl:px-10 mx-auto">
        <AngelsList lang={lang} translation={translation} />
        <Button
          text={makeContribution}
          className="w-full laptop:h-[67px]"
        ></Button>
      </div>
    </div>
  );
}

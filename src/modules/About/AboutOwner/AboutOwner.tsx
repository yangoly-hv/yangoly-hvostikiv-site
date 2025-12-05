"use client";
import InfoBlock from "@/shared/components/InfoBlock/InfoBlock";
import { IAboutOwnerTranslation } from "@/shared/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { generalSlideUp } from "@/shared/utils";

const AboutOwner = ({
  translation,
//     @ts-expect-error
    founders
}: {
  translation: IAboutOwnerTranslation;
}) => {
    //@ts-expect-error
    const paragraphs = founders.description.map(({children}) => ({segments: [{text: children[0].text, bold: false}]}));

    return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-0">
      <InfoBlock
        titleClassName="laptop:w-[583px] xl:text-left"
        className="px-[30px] py-[40px] flex flex-col justify-center rounded-[20px] xl:px-[75px] laptop:px-[89px] xl:py-10"
        translation={{paragraphs, title: founders.title}}
      />
      <motion.div
        className="relative w-full max-w-[532px] xl:max-w-[732px] laptop:max-w-full aspect-[722/689] xl:aspect-[543/830] laptop:aspect-[543/640] desk:aspect-[722/689] mx-auto xl:mx-0 rounded-[20px] overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={generalSlideUp}
        custom={0.4}
      >
        <Image
          src={founders.image}
          alt="Foundation Owner"
          fill
          className="object-top object-cover"
          quality={75}
          priority
        />
      </motion.div>
    </div>
  );
};

export default AboutOwner;

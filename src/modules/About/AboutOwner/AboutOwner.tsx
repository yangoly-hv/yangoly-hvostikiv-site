"use client";
import InfoBlock from "@/shared/components/InfoBlock/InfoBlock";
import { IAboutOwnerTranslation } from "@/shared/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { generalSlideUp } from "@/shared/utils";

const AboutOwner = ({
  translation,
}: {
  translation: IAboutOwnerTranslation;
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-[200px] laptop:gap-0">
      <InfoBlock
        titleClassName="xl:text-left"
        className="px-[30px] py-[40px] flex flex-col justify-center rounded-[20px] xl:px-[89px] xl:py-10"
        translation={translation}
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
          src="/images/owner_2.jpg"
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

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
    <div className="bg-orange-bg">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-0">
        <InfoBlock
          titleClassName="xl:text-left"
          className="px-[30px] py-[40px] flex flex-col justify-center rounded-[20px] xl:px-[89px] xl:py-10"
          translation={translation}
        />
        <motion.div
          className="relative aspect-[722/689]  mx-auto xl:mx-0 xl:max-h-[680px] xl:w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={generalSlideUp}
          custom={0.4}
        >
          <Image
            src="/images/owner.jpg"
            alt="Foundation Owner"
            fill
            className="object-contain object-top rounded-[20px] xl:object-cover"
            quality={75}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AboutOwner;

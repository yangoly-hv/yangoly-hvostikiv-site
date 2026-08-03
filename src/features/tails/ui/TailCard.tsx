"use client";

import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { PortableTextComponents } from "@portabletext/react";

import { Link } from "@/i18n/navigation";
import Button from "@/shared/components/Button/Button";
import PortableTextRender from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import type { ITails } from "@/shared/types";
import { fadeIn, slideUp } from "@/shared/utils";
import type { TailViewModel } from "../model/types";

interface TailCardProps extends ComponentProps<"div"> {
  tail: TailViewModel;
  translation: ITails;
}

const TailCard = ({ tail, translation }: TailCardProps) => {
  const { name, image, cardImage, description, sex, sterilized, slug } = tail;
  const cardImageSrc = cardImage || image;
  const portableTextComponents: PortableTextComponents = {
    block: ({ children }: { children?: ReactNode }) => (
      <p className="min-h-[73px] text-dark mb-5 text-[14px] leading-[130%] line-clamp-4">
        {children}
      </p>
    ),
  };

  return (
    <div className="flex flex-col justify-between min-h-full h-full py-8 px-4 lg:px-6 rounded-[20px] bg-[#FCFCFC] shadow-blogCard">
      <div>
        {cardImageSrc && (
          <motion.div variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <Link href={`/tails/${slug}`}>
              <div className="relative w-full mb-[26px] aspect-6/5 rounded-[16px] overflow-hidden">
                <Image src={cardImageSrc} alt={name} fill className="object-cover object-center rounded-[16px]" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" />
              </div>
            </Link>
          </motion.div>
        )}
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}>
          <Link href={`/tails/${slug}`}>
            <h2 className="mb-3 text-black text-[20px] font-semibold leading-[130%] line-clamp-1 focus-visible:text-primary-gray xl:hover:text-primary-gray transition duration-300 ease-out">
              {name}
            </h2>
          </Link>
        </motion.div>
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.4} className="flex items-center gap-x-2 mb-3 text-[14px] leading-[130%]">
          <p className="px-6 text-dark py-[8.5px] border border-black rounded-[28px]">{sex}</p>
          <p className="px-6 text-dark py-[8.5px] border border-black rounded-[28px]">{sterilized}</p>
        </motion.div>
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6}>
          <PortableTextRender value={description} components={portableTextComponents} />
        </motion.div>
      </div>

      <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.8} className="block mt-auto h-[47px]">
        <Link href={`/tails/${slug}`}>
          <Button text={translation.detailsButton} fullWidth />
        </Link>
      </motion.div>
    </div>
  );
};

export default TailCard;

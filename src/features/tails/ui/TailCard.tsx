import type { ComponentProps } from "react";
import * as motion from "motion/react-client";

import { Link } from "@/i18n/navigation";
import Button from "@/shared/components/Button/Button";
import type { ITails } from "@/shared/types";
import { fadeInAt, slideUpAt } from "@/shared/utils";
import type { TailViewModel } from "../model/types";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
interface TailCardProps extends ComponentProps<"div"> {
  tail: TailViewModel;
  translation: ITails;
}

const TailCard = ({ tail, translation }: TailCardProps) => {
  const { name, image, cardImage, description, sex, sterilized, slug } = tail;
  const cardImageSrc = cardImage || image;
  const descriptionText = description
    .flatMap((block) => block.children ?? [])
    .map((child) => child.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="flex flex-col justify-between min-h-full h-full py-8 px-4 lg:px-6 rounded-[20px] bg-[#FCFCFC] shadow-blogCard">
      <div>
        {cardImageSrc && (
          <motion.div variants={slideUpAt()} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link href={`/tails/${slug}`}>
              <div className="relative w-full mb-[26px] aspect-6/5 rounded-[16px] overflow-hidden">
                <SafeImage src={cardImageSrc} alt={name} fill className="object-cover object-center rounded-[16px]" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" />
              </div>
            </Link>
          </motion.div>
        )}
        <motion.div variants={fadeInAt(0.2)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Link href={`/tails/${slug}`}>
            <h2 className="mb-3 text-black text-[20px] font-semibold leading-[130%] line-clamp-1 focus-visible:text-primary-gray xl:hover:text-primary-gray transition duration-300 ease-out">
              {name}
            </h2>
          </Link>
        </motion.div>
        <motion.div variants={fadeInAt(0.4)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-center gap-x-2 mb-3 text-[14px] leading-[130%]">
          <p className="px-6 text-dark py-[8.5px] border border-black rounded-[28px]">{sex}</p>
          <p className="px-6 text-dark py-[8.5px] border border-black rounded-[28px]">{sterilized}</p>
        </motion.div>
        <motion.div variants={fadeInAt(0.6)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {descriptionText && (
            <p className="min-h-[73px] text-dark mb-5 text-[14px] leading-[130%] line-clamp-4">
              {descriptionText}
            </p>
          )}
        </motion.div>
      </div>

      <motion.div variants={fadeInAt(0.8)} initial="hidden" whileInView="visible" viewport={{ once: true }} className="block mt-auto h-[47px]">
        <Link href={`/tails/${slug}`}>
          <Button text={translation.detailsButton} fullWidth />
        </Link>
      </motion.div>
    </div>
  );
};

export default TailCard;

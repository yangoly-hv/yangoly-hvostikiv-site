import { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../Button/Button";
import { ITailItem, ITails } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/shared/utils";
import PortableTextRender from "@/shared/components/PortableTextRenderer/PortableTextRenderer";

interface ITailCardProps extends ComponentProps<"div"> {
  tail: ITailItem;
  translation: ITails;
}

const TailCard = ({ tail, translation }: ITailCardProps) => {
  const { detailsButton } = translation;
  //@ts-expect-error
  const { name, image, description, sex, sterilized, slug } = tail;

  return (
    <div className="flex flex-col justify-between w-full min-h-full h-full py-8 px-4 lg:px-6 rounded-[20px] bg-[#FCFCFC] shadow-blogCard">
      <div>
        {" "}
        {image && (
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <Link href={`/tails/${slug}`}>
              <div className="relative w-full h-[246px] desk:h-[323px] mb-[26px] aspect-[296/246] rounded-[16px]">
                <Image
                  src={image}
                  alt="Photo"
                  fill
                  className="object-cover object-center rounded-[16px]"
                  sizes="(max-width: 1280px) 50vw, 33vw"
                />
              </div>
            </Link>
          </motion.div>
        )}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
        >
          <Link href={`/tails/${slug}`}>
            <h2
              className="mb-3 text-black text-[20px] font-semibold leading-[130%] line-clamp-1 focus-visible:text-primary-gray xl:hover:text-primary-gray
            transition duration-300 ease-out"
            >
              {name}
            </h2>
          </Link>
        </motion.div>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.4}
          className="flex items-center gap-x-2 mb-3 text-[14px] leading-[130%]"
        >
          <p className="px-6 text-dark py-[8.5px] border border-black rounded-[28px]">
            {sex}
          </p>
          <p className="px-6 text-dark py-[8.5px] border border-black rounded-[28px]">
            {sterilized}
          </p>
        </motion.div>
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.6}
          className="min-h-[73px] text-dark mb-5 text-[14px] leading-[130%] line-clamp-4"
        >
          <PortableTextRender value={description} />
        </motion.p>
      </div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.8}
        className="block mt-auto h-[47px]"
      >
        <Link href={`/tails/${slug}`}>
          <Button text={detailsButton} fullWidth />
        </Link>
      </motion.div>
    </div>
  );
};

export default TailCard;

"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "@/shared/components/Button/Button";
import { IBlogCardProps } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/shared/utils";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";

export default function BlogCard({
  blogItem,
  className = "",
  translation,
}: IBlogCardProps) {
  const { mainPhoto, date, title, description, slug } = blogItem;
  const { detailsButton } = translation;

  return (
    <div
      className={`max-w-[343px] desk:max-w-[436px] pt-8 pb-5 px-6 bg-white rounded-[20px] shadow-blogCard ${className}`}
    >
      {mainPhoto && <motion.div
        variants={slideUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
      >
        <Link href={`/blog/${slug}`} className="block mb-[26px]">
          <div className="relative w-full h-[246px] desk:h-[323px] aspect-[295/246] rounded-[11.25px]">
            <Image
              src={mainPhoto}
              alt={title}
              fill
              className="object-cover object-center rounded-[11.25px]"
              sizes="(max-width: 1280px) 50vw, 33vw"
            />
          </div>
        </Link>
      </motion.div>}
      <motion.p
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.2}
        className="mb-3 text-dark text-[16px] font-medium leading-[20.8px]"
      >
        {date}
      </motion.p>
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.4}
      >
        <Link href={`/blog/${slug}`}>
          <h2
            className="mb-3 text-dark text-[20px] font-semibold leading-[26px] line-clamp-2 focus-visible:text-primary-gray xl:hover:text-primary-gray
            transition duration-300 ease-out"
          >
            {title}
          </h2>
        </Link>
      </motion.div>
      <motion.p
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.6}
        className="mb-5 text-dark font-normal text-[14px] leading-[18.2px] line-clamp-4"
      >
        <PortableTextRenderer value={description} />
      </motion.p>
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0.8}
      >
        <Link href={`/blog/${slug}`}>
          <Button text={detailsButton} fullWidth />
        </Link>
      </motion.div>
    </div>
  );
}

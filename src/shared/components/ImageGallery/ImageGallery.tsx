"use client";
import { IImageGalleryProps } from "@/shared/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { generalSlideUp } from "@/shared/utils";

const ImageGallery = ({
  images,
  variant,
  className = "",
}: IImageGalleryProps) => {
  if (variant === "splitLayout") {
    return (
      <div className={`grid grid-cols-2 gap-4 xl:gap-5 ${className} h-full`}>
        <motion.div
          className="relative w-full h-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={generalSlideUp}
          custom={0.2}
        >
          <div className="absolute inset-0">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover object-top rounded-lg xl:rounded-[16px]"
              sizes="(max-width: 1280px) 50vw, 33vw"
              priority
            />
          </div>
        </motion.div>
        <div className="flex flex-col gap-4 xl:gap-5 h-full">
          <motion.div
            className="relative w-full flex-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={generalSlideUp}
            custom={0.4}
          >
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              className="object-cover rounded-lg xl:rounded-[16px]"
              sizes="(max-width: 1280px) 50vw, 33vw"
            />
          </motion.div>
          {images[2] && (
            <motion.div
              className="relative w-full flex-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={generalSlideUp}
              custom={0.6}
            >
              <Image
                src={images[2].src}
                alt={images[2].alt}
                fill
                className="object-cover rounded-lg xl:rounded-[16px]"
                sizes="(max-width: 1280px) 50vw, 33vw"
              />
            </motion.div>
          )}
        </div>
      </div>
    );
  }
  if (variant === "fourGrid") {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {images.slice(0, 4).map((image, index) => (
          <motion.div
            key={index}
            className="relative w-full aspect-square"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={generalSlideUp}
            custom={0.2 + index * 0.2}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1280px) 50vw, 33vw"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

export default ImageGallery;

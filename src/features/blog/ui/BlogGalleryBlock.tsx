"use client";

import { useState, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import * as motion from "motion/react-client";
import Image from "next/image";
import clsx from "clsx";
import LargePhotoModal from "@/shared/components/LargePhotoModal/LargePhotoModal";
import SlidesPagination from "@/shared/ui/SlidesPagination";
import type { BlogContentBlock } from "../model/types";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

type BlogGalleryBlockType = Extract<
  BlogContentBlock,
  { _type: "blogGalleryBlock" }
>;

interface Props {
  block: BlogGalleryBlockType;
}

export default function BlogGalleryBlock({ block }: Props) {
  const { images } = block;
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const swiperRef = useRef<SwiperInstance | null>(null);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);
  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  if (!images?.length) return null;

  return (
    <section className="pb-[60px]">
      <div className="container mx-auto py-8 px-4 xl:px-[40px]">
        <Swiper
          spaceBetween={10}
          slidesPerView={1.1}
          breakpoints={{
            375: { slidesPerView: 1.1 },
            768: { slidesPerView: 2.1 },
            1366: { slidesPerView: 4.1 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsPrevDisabled(swiper.isBeginning);
            setIsNextDisabled(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsPrevDisabled(swiper.isBeginning);
            setIsNextDisabled(swiper.isEnd);
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={img.url + index}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.2 + (index % 4) * 0.2,
                    },
                  },
                }}
                className="relative aspect-328/377 w-full cursor-pointer"
                onClick={() => setOpenPhoto(img.url)}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? `Photo ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 90vw, (max-width: 1366px) 45vw, 320px"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          className={clsx(
            "mt-[40px] flex justify-center gap-6",
            isPrevDisabled && isNextDisabled && "hidden"
          )}
        >
          <SlidesPagination
            className="bg-orange"
            direction="prev"
            onClick={handlePrev}
            disabled={isPrevDisabled}
          />
          <SlidesPagination
            className="bg-orange"
            direction="next"
            onClick={handleNext}
            disabled={isNextDisabled}
          />
        </div>
      </div>

      {openPhoto && (
        <LargePhotoModal
          photoSrc={openPhoto}
          onClose={() => setOpenPhoto(null)}
        />
      )}
    </section>
  );
}

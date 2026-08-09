"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import * as motion from "motion/react-client";
import LargePhotoModal from "@/shared/components/LargePhotoModal/LargePhotoModal";
import type { BlogContentBlock } from "../model/types";
import { useSwiperNavigation } from "@/shared/hooks/useSwiperNavigation";
import SliderNavigationControls from "@/shared/components/SliderNavigationControls/SliderNavigationControls";

import "swiper/css";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
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
  const { isPrevDisabled, isNextDisabled, onSwiper, onSlideChange, previous, next } =
    useSwiperNavigation();

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
          onSwiper={onSwiper}
          onSlideChange={onSlideChange}
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
                <SafeImage
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
        <SliderNavigationControls
          className="mt-[40px]"
          isPrevDisabled={isPrevDisabled}
          isNextDisabled={isNextDisabled}
          onPrevious={previous}
          onNext={next}
        />
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

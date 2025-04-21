"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import * as motion from "motion/react-client";
import Image from "next/image";
import LargePhotoModal from "@/shared/components/LargePhotoModal/LargePhotoModal";

import "swiper/css";
import "swiper/css/pagination";

interface GallerySliderProps {
  slides: string[];
}

const GallerySlider = ({ slides }: GallerySliderProps) => {
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mt-[80px]">
        <Swiper
          spaceBetween={10}
          slidesPerView={1.1}
          breakpoints={{
            375: { slidesPerView: 1.1 },
            768: { slidesPerView: 2.1 },
            1366: { slidesPerView: 4.1 },
          }}
          pagination={{
            clickable: true,
            renderBullet: (_, className) =>
              `<span class="${className}"></span>`,
          }}
          modules={[Pagination]}
        >
          {slides.map((src, index) => (
            <SwiperSlide key={index}>
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
                className="relative aspect-[343/248] w-full cursor-pointer"
                onClick={() => setOpenPhoto(src)}
              >
                <Image
                  src={src}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {openPhoto && (
        <LargePhotoModal
          photoSrc={openPhoto}
          onClose={() => setOpenPhoto(null)}
        />
      )}
    </div>
  );
};

export default GallerySlider;

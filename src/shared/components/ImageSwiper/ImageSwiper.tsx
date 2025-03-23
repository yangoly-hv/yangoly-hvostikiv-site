"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import "../../../app/globals.css";
const ImageSwiper = ({ slides }: { slides: string[] }) => {
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);

  return (
    <>
      <div>
        <Swiper
          spaceBetween={10}
          slidesPerView={1.1}
          breakpoints={{
            375: {
              slidesPerView: 1.1,
            },
            768: {
              slidesPerView: 2.1,
            },
            1366: {
              slidesPerView: 4.1,
            },
          }}
          pagination={{
            clickable: true,
            renderBullet: function (_, className) {
              return '<span class="' + className + '"></span>';
            },
          }}
          modules={[Pagination]}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {slides.map((src: string, index: number) => (
            <SwiperSlide key={index}>
              <div
                className="relative aspect-[343/248] w-full cursor-pointer"
                onClick={() => setOpenPhoto(src)}
              >
                <Image
                  src={src}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <AnimatePresence>
        {openPhoto && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenPhoto(null)}
          >
            <motion.div
              className="relative w-[90vw] max-w-[800px] h-[90vh] max-h-[600px]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={openPhoto}
                alt="Full-size Image"
                fill={true}
                className="object-contain rounded-lg"
              />
              <button
                className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-2 z-10 hover:bg-opacity-75 hover:scale-110 transition duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPhoto(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M17.75 2.0125L15.9875 0.25L9 7.2375L2.0125 0.25L0.25 2.0125L7.2375 9L0.25 15.9875L2.0125 17.75L9 10.7625L15.9875 17.75L17.75 15.9875L10.7625 9L17.75 2.0125Z"
                    fill="white"
                  />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageSwiper;

"use client";
import React, { useRef, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import clsx from "clsx";
import SlidesPagination from "@/modules/Pagination/SlidesPagination/SlidesPagination";

const EventsSlider = ({ images }: { images: string[] }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  const handlePrev = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, []);

  return (
    <div className="w-full">
      <Swiper
        centeredSlides={true}
        spaceBetween={10}
        slidesPerView={1}
        breakpoints={{
          360: { slidesPerView: 1 },
        }}
        modules={[Pagination]}
        onSlideChange={(swiper) => {
          setIsPrevDisabled(swiper.isBeginning);
          setIsNextDisabled(swiper.isEnd);
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsPrevDisabled(swiper.isBeginning);
          setIsNextDisabled(swiper.isEnd);
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
            }}
          >
            <Image
              src={image}
              alt={`Partner ${index + 1}`}
              className=" rounded-[8px] object-cover w-[328px] h-[377px] md:w-[428px] md:h-[500px]"
              width={328}
              height={377}
              priority={index === 0}
              quality={75}
            />
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
  );
};

export default React.memo(EventsSlider);

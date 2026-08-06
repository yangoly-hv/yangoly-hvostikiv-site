"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useSwiperNavigation } from "@/shared/hooks/useSwiperNavigation";
import SliderNavigationControls from "@/shared/components/SliderNavigationControls/SliderNavigationControls";

const EventsSlider = ({ images }: { images: string[] }) => {
  const { isPrevDisabled, isNextDisabled, onSwiper, onSlideChange, previous, next } =
    useSwiperNavigation();

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
        onSlideChange={onSlideChange}
        onSwiper={onSwiper}
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
      <SliderNavigationControls
        className="mt-[40px]"
        isPrevDisabled={isPrevDisabled}
        isNextDisabled={isNextDisabled}
        onPrevious={previous}
        onNext={next}
      />
    </div>
  );
};

export default React.memo(EventsSlider);

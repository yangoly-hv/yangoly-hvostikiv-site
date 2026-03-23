"use client";

import React, { useRef, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import clsx from "clsx";
import SlidesPagination from "@/modules/Pagination/SlidesPagination/SlidesPagination";

type ReportSliderProps = {
    images: string[];
};

const ReportSlider = ({ images }: ReportSliderProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swiperRef = useRef<any>(null);

    const [isPrevDisabled, setIsPrevDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(false);

    const handlePrev = useCallback(() => {
        swiperRef.current?.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        swiperRef.current?.slideNext();
    }, []);

    return (
        <div className="relative
    w-[100vw]
    ml-[calc(50%_-_50vw)]">
            <Swiper
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    1024: {
                        slidesPerView: "auto",
                    },
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
                        className="flex justify-center lg:!w-[520px]"
                    >
                        <Image
                            src={image}
                            alt={`Partner ${index + 1}`}
                            className="
                            mx-auto
                rounded-[8px] object-cover
                w-[330px] h-[250px]
                lg:w-[520px] lg:h-[400px]
              "
                            width={520}
                            height={400}
                            priority={index === 0}
                            quality={75}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Pagination arrows */}
            <div
                className={clsx(
                    "mt-[24px] flex justify-center gap-[25px] lg:gap-[12px]",
                    "lg:absolute lg:top-[-90px] lg:right-[40px] lg:mt-0",
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

export default React.memo(ReportSlider);

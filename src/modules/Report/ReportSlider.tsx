"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { CircleArrowIcon, CloseIcon } from "../../../public/images/icons";
import { useSwiperNavigation } from "@/shared/hooks/useSwiperNavigation";
import SliderNavigationControls from "@/shared/components/SliderNavigationControls/SliderNavigationControls";

type ReportSliderProps = {
    images: string[];
};

const modalImageVariants = {
    enter: (direction: number) => ({
        opacity: 0,
        x: direction === 0 ? 0 : direction * 80,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction === 0 ? 0 : direction * -80,
    }),
};

const ReportSlider = ({ images }: ReportSliderProps) => {
    const { isPrevDisabled, isNextDisabled, onSwiper, onSlideChange, previous, next } =
        useSwiperNavigation();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDirection, setModalDirection] = useState(0);

    const openModal = useCallback((index: number) => {
        setModalDirection(0);
        setSelectedIndex(index);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleModalPrev = useCallback(() => {
        setModalDirection(-1);
        setSelectedIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }, [images.length]);

    const handleModalNext = useCallback(() => {
        setModalDirection(1);
        setSelectedIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, [images.length]);

    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeModal();
            if (event.key === "ArrowLeft" && images.length > 1) handleModalPrev();
            if (event.key === "ArrowRight" && images.length > 1) handleModalNext();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [closeModal, handleModalNext, handleModalPrev, images.length, isModalOpen]);

    const modalImageSrc = isModalOpen ? images[selectedIndex] : "";

    return (
        <div className="relative
    w-screen
    ml-[calc(50%-50vw)]">
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
                onSlideChange={onSlideChange}
                onSwiper={onSwiper}
            >
                {images.map((image, index) => {
                    const imageSrc = image;

                    if (!imageSrc) return null;

                    return (
                        <SwiperSlide
                            key={image}
                            className="flex justify-center lg:w-[520px]!"
                        >
                            <button
                                type="button"
                                className="relative mx-auto block w-[330px] lg:w-[520px] aspect-13/10 rounded-[8px] overflow-hidden"
                                onClick={(event) => {
                                    event.preventDefault();
                                    openModal(index);
                                }}
                                aria-label={`Open report image ${index + 1}`}
                            >
                                <Image
                                    src={imageSrc}
                                    alt={`Report ${index + 1}`}
                                    className="object-cover transition duration-500 ease-out hover:scale-[1.03]"
                                    fill
                                    sizes="(max-width: 1023px) 330px, 520px"
                                    priority={index === 0}
                                    quality={75}
                                />
                            </button>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Pagination arrows */}
            <SliderNavigationControls
                className="mt-[24px] gap-[25px] lg:absolute lg:right-[40px] lg:top-[-90px] lg:mt-0 lg:gap-[12px]"
                isPrevDisabled={isPrevDisabled}
                isNextDisabled={isNextDisabled}
                onPrevious={previous}
                onNext={next}
            />

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    >
                        <motion.div
                            className="relative w-full max-w-[1040px] aspect-13/10 overflow-hidden rounded-[8px] bg-black"
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.92, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <AnimatePresence initial={false} custom={modalDirection}>
                                {modalImageSrc && (
                                    <motion.img
                                        key={`${selectedIndex}-${modalImageSrc}`}
                                        src={modalImageSrc}
                                        alt={`Report ${selectedIndex + 1}`}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        custom={modalDirection}
                                        variants={modalImageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.28, ease: "easeOut" }}
                                    />
                                )}
                            </AnimatePresence>

                            <button
                                type="button"
                                aria-label="Close image"
                                onClick={closeModal}
                                className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 transition hover:bg-white"
                            >
                                <CloseIcon variant="secondary" className="h-6 w-6" />
                            </button>

                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        aria-label="Previous image"
                                        onClick={handleModalPrev}
                                        className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/45 p-0.5 transition hover:bg-white/80 lg:left-4 lg:p-1"
                                    >
                                        <CircleArrowIcon className="h-8 w-8 lg:h-12 lg:w-12" strokeWidth="1" color="black" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next image"
                                        onClick={handleModalNext}
                                        className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/45 p-0.5 transition hover:bg-white/80 lg:right-4 lg:p-1"
                                    >
                                        <CircleArrowIcon className="h-8 w-8 rotate-180 lg:h-12 lg:w-12" strokeWidth="1" />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(ReportSlider);

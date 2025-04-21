"use client";

import { useRef, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { slideUp, generalSlideUp } from "@/shared/utils";
import FundraisingCard from "@/shared/components/FundraisingCard/FundraisingCard";
import DonateModal from "@/shared/components/DonateModal/DonateModal";
import clsx from "clsx";
import { Locale } from "@/shared/types";
import SlidesPagination from "@/modules/Pagination/SlidesPagination/SlidesPagination";

interface Props {
  lang: Locale;
  t: {
    cardTitles: string[];
    goal: string;
    currency: string;
    buttonText: string;
    image: string;
  };
}

const FundraisingSlider = ({ lang, t }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swiperRef = useRef<any>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  const handleCardClick = () => setIsModalOpen(true);
  const handlePrev = useCallback(() => swiperRef.current?.slidePrev(), []);
  const handleNext = useCallback(() => swiperRef.current?.slideNext(), []);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={slideUp}
        custom={0.2}
      >
        <Swiper
          className="flex flex-row"
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            360: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1366: { slidesPerView: 3 },
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
          {t.cardTitles.map((title, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                viewport={{ once: true }}
              >
                <FundraisingCard
                  goal={t.goal}
                  image={t.image}
                  title={title}
                  currentAmount={(index + 1) * 3000}
                  totalAmount={(index + 1) * 10000}
                  currency={t.currency}
                  buttonText={t.buttonText}
                  onClick={handleCardClick}
                />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <motion.div
        className={clsx(
          "mt-4 flex justify-center gap-6",
          isPrevDisabled && isNextDisabled && "hidden"
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={generalSlideUp}
        custom={0.4}
      >
        <SlidesPagination
          direction="prev"
          onClick={handlePrev}
          disabled={isPrevDisabled}
        />
        <SlidesPagination
          direction="next"
          onClick={handleNext}
          disabled={isNextDisabled}
        />
      </motion.div>

      {isModalOpen && (
        <DonateModal
          lang={lang}
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </>
  );
};

export default FundraisingSlider;

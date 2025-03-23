"use client";
import React, { useRef, useCallback, useState } from "react";
import { Locale } from "@/shared/types";
import FundraisingCard from "@/shared/components/FundraisingCard/FundraisingCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SlidesPagination from "../Pagination/SlidesPagination/SlidesPagination";
import clsx from "clsx";
import { motion } from "framer-motion";
import { slideUp, generalSlideUp } from "@/shared/utils";
import DonateModal from "@/shared/components/DonateModal/DonateModal";

const translations = {
  uk: {
    title: "Підтримати благодійні збори",
    cardTitles: ["Актуальний збір", "Разова допомога", "Стерилізація"],
    goal: "Ціль",
    currency: "грн",
    buttonText: "Підтримати",
    image: "/images/card-image.jpg",
  },
  en: {
    title: "Support Charity Fundraising",
    cardTitles: ["Current Fundraising", "One-Time Help", "Sterilization"],
    goal: "Goal",
    currency: "UAH",
    buttonText: "Support",
    image: "/images/card-image.jpg",
  },
};

const SupportFundraising = ({ lang }: { lang: Locale }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = translations[lang] || translations.uk;

  // const handleCardClick = useCallback(() => {
  //   console.log(`click`);
  //   setIsModalOpen(true);
  // }, []);
  const handleCardClick = () => {
    console.log(`click`);
    setIsModalOpen(true);
  };

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
    <section className="container mx-auto px-4 pt-[80px] xl:px-10 bg-orange-bg">
      <h2 className="text-black text-[24px] font-extrabold uppercase xl:text-[32px] leading-[130%] text-center mb-8">
        {t.title}
      </h2>

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
    </section>
  );
};

export default React.memo(SupportFundraising);

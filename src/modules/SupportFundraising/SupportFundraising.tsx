"use client";
import React, { useState } from "react";
import { Locale } from "@/shared/types";
import FundraisingCard from "@/shared/components/FundraisingCard/FundraisingCard";
import "swiper/css";
import "swiper/css/pagination";
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

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section className="container mx-auto px-4 xl:px-10 bg-orange-bg">
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
        <ul className="flex flex-col gap-5 md:flex-row">
          {t.cardTitles.slice(0, 3).map((title, index) => (
            <li
              key={index}
              className="w-full md:w-[calc(33%-13.3px)] min-h-full"
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
                className="min-h-full"
              />
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className={clsx("mt-4 flex justify-center gap-6")}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={generalSlideUp}
        custom={0.4}
      ></motion.div>

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

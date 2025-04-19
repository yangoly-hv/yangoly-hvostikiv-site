"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import { monthlyFundrasing } from "./mockedData";
import { IMonthlyGoalSectionProps } from "@/shared/types";
import Button from "@/shared/components/Button/Button";
import DonateModal from "@/shared/components/DonateModal/DonateModal";

const MonthlyGoalSection = ({
  translation,
  lang,
  donateModalTranslataion,
}: IMonthlyGoalSectionProps) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsDonateModalOpen(false);
  }, []);

  const monthlyFundrasingLocalized = monthlyFundrasing[lang];
  const { title, description, image, goal, current } =
    monthlyFundrasingLocalized;
  const { generalGoal, result, supportFundrasing } = translation;

  const formattedResult = result
    .replace("{{goal}}", goal.toLocaleString("uk-UA"))
    .replace("{{current}}", current.toLocaleString("uk-UA"));

  return (
    <section className="mb-[124px] xl:mb-[200px] py-6 bg-white">
      <div className="container px-4 xl:px-10 mx-auto">
        <h2 className="mb-3 xl:mb-4 font-arial text-[18px] xl:text-[40px] leading-[120%] text-center md:text-left">
          {title}
        </h2>
        <p className="mb-6 xl:mb-[37px] text-[12px] xl:text-[18px] leading-[130%] text-center md:text-left">
          {description}
        </p>
      </div>
      <div className="md:hidden relative h-[290px] max-w-[532px] mx-auto mb-6 rounded-[8px] overflow-hidden">
        <Image
          src={image?.url}
          alt={image?.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="container px-4 xl:px-10 mx-auto">
        <h3 className="mb-[11px] xl:mb-6 font-arial text-[18px] xl:text-[24px] leading-[120%] text-center md:text-left">
          {generalGoal.split("{{goal}}")[0]}
          <span className="text-green">{goal.toLocaleString("uk-UA")}</span>
          {generalGoal.split("{{goal}}")[1]}
        </h3>
        <Button fullWidth text={supportFundrasing} className="mb-3"></Button>
        <p className="text-[12px] font-semibold text-center leading-[130%] uppercase">
          {formattedResult}
        </p>
      </div>
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={handleCloseModal}
        translation={donateModalTranslataion}
        lang={lang}
      />
    </section>
  );
};

export default MonthlyGoalSection;

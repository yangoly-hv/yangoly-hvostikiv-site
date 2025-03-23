"use client";
import Button from "@/shared/components/Button/Button";
import FundraisingGoal from "../FundraisingGoal/FundraisingGoal";
import { IMonthlyGoalSectionProps } from "@/shared/types";
import DonateModal from "@/shared/components/DonateModal/DonateModal";
import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn, slideUp, generalSlideUp } from "@/shared/utils";

const translations = {
  uk: {
    monthlyGoalTitle: "Наша ціль на місяць",
    fundraisingTitle: "Актуальний збір",
    goal: "Ціль",
    currency: "грн",
    donateButton: "Задонатити",
    octoberGoal:
      "У жовтні фонд збирає <span className='font-bold'>30000 грн</span> щоб закупити вакцини для тварин на прифронтових територіях. Вакцинація котів та собак забезпечує захист від серйозних захворювань.",
    vaccinationArgumentsTitle: "Аргументи на користь вакцинації:",
    argument1:
      "Захист від інфекційних хвороб. Вакцини запобігають розвитку небезпечних інфекційних захворювань, таких як сказ, чумка, парвовірус та інші, які можуть бути смертельними для тварин. Вакцинація попереджає масштабні спалахи інфекцій.",
    argument2:
      "Безпека для людей. Деякі хвороби, як-от сказ, передаються від тварин до людей. Вакцинація тварин знижує ризик зараження людей.",
    argument3:
      "Довголіття та якість життя. Вакциновані тварини мають більші шанси на довге та здорове життя, оскільки їхній імунітет підготовлений до боротьби із серйозними хворобами.",
    conclusion:
      "Регулярна вакцинація котів і собак – це відповідальний крок для людей, який допомагає не лише зберегти здоров'я тварин, але й забезпечити безпеку громадян.",
  },
  en: {
    monthlyGoalTitle: "Our monthly goal",
    fundraisingTitle: "Current collection",
    goal: "Goal",
    currency: "UAH",
    donateButton: "Donate",
    vaccinationArgumentsTitle: "Arguments in favor of vaccination:",
    octoberGoal:
      "In October, the fund is raising <span style='font-weight: bold;'>30000 UAH</span> to purchase vaccines for animals in frontline territories. Vaccinating cats and dogs provides protection against serious diseases.",
    argument1:
      "Protection against infectious diseases. Vaccines prevent the development of dangerous infectious diseases such as rabies, distemper, parvovirus, and others, which can be fatal to animals. Vaccination prevents large-scale outbreaks of infections.",
    argument2:
      "Safety for people. Some diseases, such as rabies, are transmitted from animals to humans. Vaccinating animals reduces the risk of human infection.",
    argument3:
      "Longevity and quality of life. Vaccinated animals have a better chance of living a long and healthy life, as their immune system is prepared to fight serious diseases.",
    conclusion:
      "Regular vaccination of cats and dogs is a responsible step for people, helping not only to preserve the health of animals but also to ensure the safety of citizens.",
  },
};

const MonthlyGoalSection = ({
  lang,
  donateModalTranslataion,
}: IMonthlyGoalSectionProps) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsDonateModalOpen(false);
  }, []);

  const t = translations[lang];

  return (
    <section className="bg-green py-10 xl:py-0">
      <div className="container flex flex-col-reverse px-4 gap-[34px] justify-center mx-auto xl:flex-row xl:gap-[90px] xl:pt-[47px]">
        {/* Перший блок */}
        <motion.div
          className="bg-white p-5 rounded-t-[16px] xl:w-1/2 xl:pt-[40px] xl:ml-[50px] xl:rounded-t-[16px] xl:rounded-b-none xl:self-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          custom={0.2}
        >
          <motion.h2
            className="text-orange text-[24px] xl:max-w-[325px] xl:flex xl:mx-auto font-extrabold leading-[130%] uppercase font-arial text-center xl:text-[36px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.3}
          >
            {t.monthlyGoalTitle}
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            custom={0.4}
          >
            <FundraisingGoal
              fundraisingTitle={t.fundraisingTitle}
              goal={t.goal}
              currency={t.currency}
              totalAmount={30000}
              currentAmount={10000}
              styles={{
                goalClassName: "text-[#000] no-ligatures leading-[170%]",
                currentAmountClassName:
                  "text-[#000] no-ligatures leading-[170%]",
              }}
            />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={generalSlideUp}
            custom={0.5}
          >
            <Button
              onClick={() => setIsDonateModalOpen(true)}
              variant="secondary"
              className="mx-auto w-full max-w-[300px] xl:max-w-[383px] mt-[2px] flex justify-center"
              text={t.donateButton}
            />
          </motion.div>
        </motion.div>

        {/* Другий блок */}
        <motion.div
          className="bg-white p-5 xl:px-[77px] xl:py-[45px] rounded-[16px] flex flex-col gap-6 xl:w-1/2 xl:mb-[47px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
          custom={0.6}
        >
          <motion.p
            className="numeric-font text-dark text-[18px] leading-[130%]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.7}
            dangerouslySetInnerHTML={{ __html: t.octoberGoal }}
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={generalSlideUp}
            custom={0.8}
          >
            <motion.h2
              className="numeric-font text-dark text-[18px] leading-[130%] font-bold"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0.9}
            >
              {t.vaccinationArgumentsTitle}
            </motion.h2>
            <motion.ul
              className="list-disc pl-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              custom={1.0}
            >
              <motion.li
                className="numeric-font text-dark text-[18px] leading-[130%]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={generalSlideUp}
                custom={1.1}
              >
                {t.argument1}
              </motion.li>
              <motion.li
                className="numeric-font text-dark text-[18px] leading-[130%]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={generalSlideUp}
                custom={1.2}
              >
                {t.argument2}
              </motion.li>
              <motion.li
                className="numeric-font text-dark text-[18px] leading-[130%]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={generalSlideUp}
                custom={1.3}
              >
                {t.argument3}
              </motion.li>
            </motion.ul>
          </motion.div>
          <motion.p
            className="numeric-font text-dark text-[18px] leading-[130%]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={1.4}
          >
            {t.conclusion}
          </motion.p>
        </motion.div>
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

export default React.memo(MonthlyGoalSection);

import * as motion from "motion/react-client";
import FundraisingGoal from "../../../modules/FundraisingGoal/FundraisingGoal";
import DonateAction from "../DonateAction/DonateAction";
import { Locale } from "@/shared/types";

interface IFirstBlockProps {
  lang: Locale;
  buttonText: string;
  t: {
    monthlyGoalTitle: string;
    fundraisingTitle: string;
    goal: string;
    currency: string;
    donateButton: string;
  };
}

const FirstBlock = ({ buttonText, lang, t }: IFirstBlockProps) => {
  return (
    <motion.div
      className="bg-white p-5 rounded-t-[16px] xl:w-1/2 xl:pt-[40px] xl:ml-[50px] xl:rounded-t-[16px] xl:rounded-b-none xl:self-stretch"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: 0.2 },
        },
      }}
    >
      <motion.h2
        className="text-orange text-[24px] xl:max-w-[325px] xl:flex xl:mx-auto font-extrabold leading-[130%] uppercase font-arial text-center xl:text-[36px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.3 },
          },
        }}
      >
        {t.monthlyGoalTitle}
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.4 },
          },
        }}
      >
        <FundraisingGoal
          fundraisingTitle={t.fundraisingTitle}
          goal={t.goal}
          currency={t.currency}
          totalAmount={30000}
          currentAmount={10000}
          styles={{
            goalClassName: "text-[#000] no-ligatures leading-[170%]",
            currentAmountClassName: "text-[#000] no-ligatures leading-[170%]",
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.5 },
          },
        }}
      >
        <DonateAction buttonText={buttonText} lang={lang} />
      </motion.div>
    </motion.div>
  );
};

export default FirstBlock;

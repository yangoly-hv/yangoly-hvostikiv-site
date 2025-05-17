import * as motion from "motion/react-client";
import Image from "next/image";
import DonateAction from "../DonateAction/DonateAction";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";

interface IEventsDonateSection {
  title: string;
  text: string;
  buttonText: string;
}
const EventsDonateSection = async ({
  title,
  text,
  buttonText,
}: IEventsDonateSection) => {
  return (
    <section className="container mx-auto px-4 xl:px-[40px] pt-[100px] pb-[69px]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="bg-[#F4E1C1] rounded-[8px] py-6 lg:py-[39px] px-[10px] flex flex-col justify-center items-center lg:h-[320px] relative"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="px-[14px] lg:px-0 max-w-[679px] flex flex-col items-center justify-center"
        >
          <motion.h3
            variants={listItemVariants}
            className="font-arial text-[24px] leading-[130%] text-center lg:text-[32px]"
          >
            {title}
          </motion.h3>
          <motion.p
            variants={listItemVariants}
            className="text-[14px] leading-[130%] text-center mt-3 lg:mt-4 lg:text-[18px] lg:max-w-[518px]"
          >
            {text}
          </motion.p>
          <motion.div className="w-full" variants={listItemVariants}>
            <DonateAction
              variant="primary"
              className="mt-6 lg:text-[18px] lg:max-w-[620px] lg:mt-[32px] lg:h-[67px] lg:w-full"
              buttonText={buttonText}
            />
          </motion.div>
        </motion.div>
        <Image
          src="/images/events/donate-dog-1.webp"
          alt="Dog"
          width={604}
          height={403}
          className="absolute bottom-0 hidden lg:block  lg:left-[-124px] xl:left-[-30px]"
        />
        <Image
          src="/images/events/donate-dog-2.webp"
          alt="Dog"
          width={373}
          height={560}
          className="absolute bottom-0 hidden lg:block  lg:right-[-100px] xl:right-[-30px]"
        />
      </motion.div>
    </section>
  );
};

export default EventsDonateSection;

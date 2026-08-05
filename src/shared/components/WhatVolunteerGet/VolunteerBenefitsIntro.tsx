import * as motion from "motion/react-client";

import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";

type VolunteerBenefitsIntroProps = {
  title: string;
  subtitle: string;
  subtitleClassName?: string;
};

export default function VolunteerBenefitsIntro({
  title,
  subtitle,
  subtitleClassName = "",
}: VolunteerBenefitsIntroProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <motion.h2
        variants={listItemVariants}
        className="font-arial text-[24px] uppercase leading-[130%] lg:text-[32px]"
      >
        {title}
      </motion.h2>
      <motion.p
        variants={listItemVariants}
        className={`mt-4 text-[18px] font-medium leading-[130%] ${subtitleClassName}`}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}

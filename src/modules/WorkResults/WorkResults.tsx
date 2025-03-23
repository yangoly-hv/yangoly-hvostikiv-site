"use client";
import AchievementItem from "@/shared/components/AchievementItem/AchievementItem";
import { IWorkResult } from "@/shared/types";
import { motion } from "framer-motion";
import { generalSlideUp } from "@/shared/utils";

const WorkResults = ({ translation }: { translation: IWorkResult[] }) => {
  return (
    <section className="flex justify-center items-center py-[120px] md:py-[56px] px-[80px] bg-[#140A01] ">
      <motion.ul
        className="flex gap-[54px] flex-col md:flex-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {translation.map((item: IWorkResult, index) => (
          <motion.li
            key={index}
            variants={generalSlideUp}
            custom={index * 0.2}
            initial="hidden"
            viewport={{ once: true }}
            whileInView="visible"
          >
            <AchievementItem count={item.count} action={item.action} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default WorkResults;

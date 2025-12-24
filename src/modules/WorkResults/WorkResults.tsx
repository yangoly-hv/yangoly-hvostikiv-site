import * as motion from "motion/react-client";
import AchievementItem from "@/shared/components/AchievementItem/AchievementItem";
import { IWorkResult } from "@/shared/types";
import { getTranslations } from "next-intl/server";

import client from "@/shared/lib/sanity";
import {perfomanceQuery} from "@/shared/lib/queries";


const  WorkResults = async () => {
  const t = await getTranslations("");
  const translation = (await t.raw("WorkResults")) as IWorkResult[];
    const { tailsCount, feedCount, vaccinesCount, treatmentsCount } = await client.fetch(perfomanceQuery);
    translation[0].amount = `${tailsCount}+`;
    translation[1].amount = `${feedCount}+`;
    translation[2].amount = `${vaccinesCount}+`;
    translation[2].amount = `${treatmentsCount}+`;

    // const data = [];

    // if (!data) {
    //     return null;
    // }

  return (
    <section className="flex justify-center items-center py-[120px] md:py-[56px] px-[80px] bg-[#140A01]">
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex gap-[54px] flex-col md:flex-row"
      >
        {translation.map((item: IWorkResult, index: number) => (
          <motion.li
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2 + index * 0.2,
                },
              },
            }}
          >
            <AchievementItem amount={item.amount} name={item.name} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default WorkResults;

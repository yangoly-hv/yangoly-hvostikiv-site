import * as motion from "motion/react-client";
import AchievementItem from "@/shared/components/AchievementItem/AchievementItem";
import { IWorkResult } from "@/shared/types";
// import { getTranslations } from "next-intl/server";

import client from "@/shared/lib/sanity";
import {topDotatorsQuery} from "@/shared/lib/queries";

//@ts-expect-error
const WorkResults = async ({locale}) => {
  // const t = await getTranslations("");
  // const translation = (await t.raw("WorkResults")) as IWorkResult[];

    const data = await client.fetch(topDotatorsQuery, {
        lang: locale,
    });

    if (!data) {
        return null;
    }

  return (
    <section className="flex justify-center items-center py-[120px] md:py-[56px] px-[80px] bg-[#140A01]">
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex gap-[54px] flex-col md:flex-row"
      >
        {data.map((item: IWorkResult, index: number) => (
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

import * as motion from "motion/react-client";
import AchievementItem from "@/shared/components/AchievementItem/AchievementItem";
import { IWorkResult } from "@/shared/types";
import { getTranslations } from "next-intl/server";
import { getPerformance } from "@/features/home/server/data";


const  WorkResults = async () => {
  const t = await getTranslations("");
  const translation = (await t.raw("WorkResults")) as IWorkResult[];
  const performance = await getPerformance();

  if (!performance) return null;

  const amounts = [
    performance.tailsCount,
    performance.feedCount,
    performance.vaccinesCount,
    performance.treatmentsCount,
  ];
  const results = translation.map((item, index) => ({
    ...item,
    amount: `${amounts[index] ?? 0}+`,
  }));

  return (
    <section className="flex justify-center items-center py-[120px] md:py-[56px] px-4 md:px-[80px] bg-green">
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-x-4 gap-y-10 w-full max-w-[420px] md:max-w-none md:flex md:w-auto md:gap-[54px] xl:gap-[110px] md:items-start"
      >
        {results.map((item, index) => (
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

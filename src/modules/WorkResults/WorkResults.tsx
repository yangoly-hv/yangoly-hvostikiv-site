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
    <section className="relative z-10 flex justify-center items-center py-[40px] md:py-[48px] px-4 md:px-[32px] lg:px-[40px] xl:px-[80px] bg-green">
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-x-4 gap-y-6 w-full max-w-[420px] md:max-w-none md:flex md:w-full md:items-center md:justify-between md:gap-4 xl:gap-[110px] xl:w-auto"
      >
        {results.map((item, index) => (
          <motion.li
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:min-w-0 md:flex-1"
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

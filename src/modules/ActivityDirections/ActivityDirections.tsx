import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";

const ActivityDirections = async () => {
  const t = await getTranslations("ActivityDirections");
  const title = t("title");
  const items = (await t.raw("items")) as string[];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 xl:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center uppercase font-arial font-extrabold text-[20px] xl:text-[32px] text-[#140A01] leading-[130%] mb-6 md:mb-8"
        >
          {title}
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-3.5">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: 0.1 + index * 0.1,
              }}
              viewport={{ once: true, amount: 0.2 }}
              className={[
                "flex items-center px-4 md:px-6 bg-white border-2 border-black rounded-lg",
                "h-[93px] md:h-[113px]",
                "md:flex-1",
                index === 0 && "md:max-w-[363px] md:flex-none",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="text-black text-[14px] md:text-[16px] font-light leading-[130%]">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityDirections;

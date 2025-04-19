import Image from "next/image";
import * as motion from "motion/react-client";

interface IMissionProps {
  missionTitle: string;
  missionParagraph: string;
}

const Mission = ({ missionTitle, missionParagraph }: IMissionProps) => {
  return (
    <div className="relative pt-[58px] xl:pt-[142px] xl:h-[620px]">
      <div className="container mx-auto px-4 xl:px-[40px]">
        {/* Заголовок */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut", delay: 0 },
            },
          }}
          className="text-[#FF9332] text-[24px] xl:text-[64px] font-black uppercase leading-[130%] xl:max-w-[622px]"
        >
          {missionTitle}
        </motion.h2>

        {/* Параграф */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
            },
          }}
          className="text-black text-[14px] md:text-[18px] leading-[130%] xl:text-[32px] mt-4 xl:max-w-[622px]"
        >
          {missionParagraph}
        </motion.p>
      </div>

      {/* Зображення мобільне */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.4 },
          },
        }}
      >
        <Image
          src="/images/events/pets.png"
          alt="Pets"
          width={362}
          height={189}
          className="mt-[58px] ml-auto xl:hidden"
        />
      </motion.div>

      {/* Зображення десктопне */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.4 },
          },
        }}
      >
        <Image
          src="/images/events/pets.png"
          alt="Pets"
          width={850}
          height={497}
          className="absolute right-0 bottom-0 hidden xl:flex"
        />
      </motion.div>
    </div>
  );
};

export default Mission;

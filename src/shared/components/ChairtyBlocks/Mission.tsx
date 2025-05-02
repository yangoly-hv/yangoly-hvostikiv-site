import Image from "next/image";
import * as motion from "motion/react-client";

interface IMissionProps {
  missionTitle: string;
  missionParagraph: string;
}

const Mission = ({ missionTitle, missionParagraph }: IMissionProps) => {
  return (
    <div className="relative pt-[100px] md:pt-[120px] lg:flex lg:items-center xl:pt-[142px] ">
      <div className="container mx-auto px-4 xl:px-[40px] mb-[20px]">
        <div className="md:max-w-[400px] lg:max-w-[622px]">
          {/* Заголовок */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0 },
              },
            }}
            className="text-[#EACCAA] text-[24px] lg:text-[64px] font-black uppercase leading-[130%] xl:max-w-[622px]"
          >
            {missionTitle}
          </motion.h2>

          {/* Параграф */}
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
              },
            }}
            className="text-black text-[14px] md:text-[18px] leading-[130%] lg:text-[32px] mt-4 xl:max-w-[622px]"
          >
            {missionParagraph}
          </motion.p>
        </div>
      </div>

      {/* Зображення мобільне */}
      <motion.div
        className="relative w-full aspect-[360/227] md:hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Бекграунд */}
        <div className="absolute inset-0">
          <Image
            src="/images/events/mission-bg-mob.png"
            alt="Mission BG"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Тваринки поверх */}
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/events/pets.png"
            alt="Pets"
            fill
            className="object-contain object-bottom pl-4"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Десктопне зображення фону + тваринок */}
      <motion.div
        className="hidden md:block relative w-full aspect-[989/724]"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Фон */}
        <div className="absolute inset-0">
          <Image
            src="/images/events/mission-bg-desk.png"
            alt="Mission BG"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Тваринки */}
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/events/pets.png"
            alt="Pets"
            fill
            className="object-contain object-bottom"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Mission;

import Image from "next/image";
import * as motion from "motion/react-client";

interface IMissionProps {
  missionTitle: string;
  missionParagraph: string;
}

const Mission = ({ missionTitle, missionParagraph }: IMissionProps) => {
  return (
    <section className="pt-[120px] xl:pt-[56px]">
      <div className="relative container mx-auto px-4 xl:px-[40px] max-w-[1560px] flex flex-col-reverse items-center gap-[20px] md:grid md:grid-cols-[minmax(0,698px)_minmax(0,734px)] md:items-stretch md:gap-0 md:max-h-[317px]">
        <div className="absolute z-10 top-1/2 -translate-y-1/2 right-0 md:top-[-18px] md:translate-y-0 md:right-[calc(50%-60px)] w-[101px] h-[143px] lg:w-[150px] lg:h-[210px] xl:w-[237px] xl:h-[335px]">
          <Image src="/images/events/mission-emblem.webp"
            alt=""
            fill
            className="object-cover rounded-[8px]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="w-full min-w-0 md:max-w-none flex items-center shrink-0 bg-white rounded-[8px] px-[24px] py-[44px] lg:pl-[68px] lg:pr-[192px] lg:py-[90px]">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.4 },
              },
            }}
            className="sr-only"
          >
            {missionTitle}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
              },
            }}
            className="text-black leading-[130%] text-[18px] font-light"
          >
            {missionParagraph}
          </motion.p>
        </div>
        <div className="relative w-full h-[232px] md:aspect-auto md:min-h-[317px] md:h-full md:min-w-0">
          <Image
            src="/images/events/mission-photo.webp"
            alt=""
            fill
            className="object-cover rounded-[8px] w-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>
    </section>
  );
};

export default Mission;

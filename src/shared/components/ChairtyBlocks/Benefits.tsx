import Image from "next/image";
import * as motion from "motion/react-client";

interface IBenefitsProps {
  benefitsTitle: string;
  benefitsParagraphs: string[];
}

const Benefits = ({ benefitsTitle, benefitsParagraphs }: IBenefitsProps) => {
  return (
    <div className="bg-[#140A01] py-[70px]">
      <div className="container mx-auto px-4 xl:px-[40px] xl:pl-[100px] laptop:pl-[114px] md:flex md:gap-[40px] xl:flex-row-reverse xl:gap-[130px]">
        {/* Мобільне зображення */}
        <motion.div
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
        >
          <Image
            src="/images/events/benefits-mob.jpg"
            alt="Event"
            width={328}
            height={286}
            className="object-cover flex mx-auto rounded-[8px] xl:hidden"
            quality={75}
          />
        </motion.div>

        {/* Десктопне зображення */}
        <motion.div
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
        >
          <Image
            src="/images/events/benefits-desk.jpg"
            alt="Event"
            width={747}
            height={286}
            className="object-cover hidden mx-auto rounded-[8px] xl:flex"
            quality={75}
          />
        </motion.div>

        <div>
          {/* Заголовок */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: "easeOut", delay: 0.4 },
              },
            }}
            className="text-[24px] font-arial font-black uppercase text-white mt-[40px] md:mt-0"
          >
            {benefitsTitle}
          </motion.h2>

          {/* Список переваг */}
          <ul className="mt-6 flex flex-col gap-4">
            {benefitsParagraphs.map((paragraph, index) => (
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
                      duration: 0.5,
                      ease: "easeOut",
                      delay: 0.6 + index * 0.2,
                    },
                  },
                }}
                className="flex gap-4"
              >
                <Image
                  src="/images/paw.marker-mob.png"
                  alt="Paw"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <p className="text-[18px] text-white leading-[130%]">
                  {paragraph}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Benefits;

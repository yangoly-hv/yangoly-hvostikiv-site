import Image from "next/image";
import * as motion from "motion/react-client";
import DonateAction from "@/shared/components/DonateAction/DonateAction";
import ContactFormAction from "@/shared/components/ContactFormAction/ContactFormAction";

interface IBenefitsProps {
  botParagraphs: string[];
  buttons: string[];
  contactFormTitle: string;
}

const ButtonsSection = ({
  botParagraphs,
  buttons,
  contactFormTitle,
}: IBenefitsProps) => {
  return (
    <div className="bg-green py-[60px]">
      <div className="container mx-auto px-4 xl:px-[40px] xl:pr-[100px] laptop:pr-[114px] bg-green">
        <div className="md:flex md:gap-4 md:justify-between xl:flex-row-reverse xl:items-center">
          {/* Текстова частина */}
          <div className="md:max-w-[450px] xl:max-w-[585px]">
            <div className="flex flex-col gap-4">
              {botParagraphs.map((paragraph: string, index: number) => (
                <motion.p
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
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
                  className="text-[14px] leading-[130%] text-white xl:text-[18px]"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Кнопки */}
            <div className="flex flex-col mt-6 gap-2 md:flex-row">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut", delay: 0.6 },
                  },
                }}
                className="w-full md:w-auto"
              >
                <DonateAction buttonText={buttons[0]} variant="secondary" />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: "easeOut", delay: 0.8 },
                  },
                }}
                className="w-full md:w-auto"
              >
                <ContactFormAction
                  buttonText={buttons[1]}
                  variant="outline"
                  modalTitle={contactFormTitle}
                  className="border-white text-white hover:text-[#34AD5D] hover:bg-white"
                />
              </motion.div>
            </div>
          </div>

          {/* Зображення моб */}
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
              src="/images/events/bot-mob.jpg"
              alt="Event"
              width={328}
              height={248}
              className="flex mx-auto mt-[28px] md:mt-0 rounded-[8px] md:mx-0 xl:hidden"
            />
          </motion.div>

          {/* Зображення десктоп */}
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
              src="/images/events/bot-desk.jpg"
              alt="Event"
              width={706}
              height={248}
              className="hidden xl:flex rounded-[8px]"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ButtonsSection;

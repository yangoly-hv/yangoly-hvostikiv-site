import { IContactsProps } from "@/shared/types";
import { EmailIcon, PhoneIcon } from "../../../public/images/icons";
import Image from "next/image";
import * as motion from "motion/react-client";
import ContactForm from "./ContactForm";

const Contacts = ({ lang, translation }: IContactsProps) => {
  const { title, subtitle } = translation;

  return (
    <section id="contacts" className="relative h-[923px] lg:h-[634px] bg-green">
      <div className="container relative z-10 px-4 xl:px-10 top-[124px] lg:top-[113px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-col items-center lg:items-start lg:max-w-[406px]">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.1 },
                },
              }}
              className="mb-3 font-arial font-black text-[24px] lg:text-[32px] text-white leading-[130%] uppercase text-center lg:text-left"
            >
              {title}
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
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}
              className="mb-10 lg:mb-12 text-[16px] lg:text-[20px] text-white leading-[130%] text-center lg:text-left"
            >
              {subtitle}
            </motion.p>

            <div className="flex flex-col gap-4">
              <motion.a
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.4 },
                  },
                }}
                href="tel:+380930000000"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <PhoneIcon className="w-6 h-6" variant="secondary" />
                38 093 000 00 00
              </motion.a>

              <motion.a
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.5 },
                  },
                }}
                href="tel:+380930000000"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <PhoneIcon className="w-6 h-6" variant="secondary" />
                38 093 000 00 00
              </motion.a>

              <motion.a
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.6 },
                  },
                }}
                href="mailto:hvostiki@gmail.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <EmailIcon className="w-6 h-6" variant="secondary" />
                hvostiki@gmail.com
              </motion.a>
            </div>
          </div>

          <ContactForm lang={lang} />
        </div>
      </div>

      <Image
        src="/images/two-dogs.webp"
        alt="Two dogs"
        width={682}
        height={974}
        priority
        className="hidden xl:block absolute bottom-0 right-[42%] z-10 w-[341px] h-auto"
      />
    </section>
  );
};

export default Contacts;

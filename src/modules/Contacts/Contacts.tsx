import { EmailIcon, PhoneIcon } from "../../../public/images/icons";
import Image from "next/image";
import * as motion from "motion/react-client";
import ContactForm from "./ContactForm";
import { getLocale, getTranslations } from "next-intl/server";
import { Locale } from "@/shared/types";

const Contacts = async () => {
  const lang = (await getLocale()) as Locale;
  const t = await getTranslations("Contacts");

  return (
    <section id="contacts" className="relative h-[800px] lg:h-[634px] bg-green">
      <div className="container relative z-10 px-4 xl:px-10 top-[60px] lg:top-[113px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-col items-center lg:items-start lg:max-w-[340px]">
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
              {t("title")}
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
              {t("subtitle")}
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
                href="tel:+380972002400"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <PhoneIcon className="w-6 h-6" variant="secondary" />
                  38 097 200 24 00
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
                href="mailto:angelsuaorg@gmail.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <EmailIcon className="w-6 h-6" variant="secondary" />
                  angelsuaorg@gmail.com
              </motion.a>
            </div>
          </div>

          <ContactForm lang={lang} />
        </div>
      </div>
        <Image
            src="/images/contacts-union.png"
            alt="Two dogs"
            width={274}
            height={373}
            priority
            className="hidden xl:block absolute bottom-0 right-[58%] z-8 w-[274px] h-auto"
        />
      <Image
        src="/images/contacts-dog.png"
        alt="Two dogs"
        width={682}
        height={1017}
        priority
        className="hidden xl:block absolute bottom-0 right-[35%] z-10 w-[678px] h-auto"
      />
    </section>
  );
};

export default Contacts;

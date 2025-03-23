"use client";
import UniversalForm from "@/shared/components/UniversalForm/UniversalForm";
import getContactFormConfig from "@/shared/formsConfigs/contactForm";
import { IContactsProps } from "@/shared/types";
import { EmailIcon, PhoneIcon } from "../../../public/images/icons";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, generalSlideUp, slideUp } from "@/shared/utils";

const Contacts = ({ lang, translation }: IContactsProps) => {
  const contactConfig = getContactFormConfig(lang);
  const { title, subtitle } = translation;
  const handleSubmit = (data: unknown) => {
    console.log(`Submited:`, data);
  };

  return (
    <section id="contacts" className="relative h-[923px] lg:h-[634px] bg-green">
      <div className="container relative z-10 px-4 xl:px-10 top-[124px] lg:top-[113px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
          <div className="flex flex-col items-center lg:items-start lg:max-w-[406px]">
            <motion.h2
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="mb-3 font-arial font-black text-[24px] lg:text-[32px] text-white leading-[130%] uppercase text-center lg:text-left"
            >
              {title}
            </motion.h2>
            <motion.p
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
              className="mb-10 lg:mb-12 text-[16px] lg:text-[20px] text-white leading-[130%] text-center lg:text-left"
            >
              {subtitle}
            </motion.p>
            <div className="flex flex-col gap-4">
              <motion.a
                variants={generalSlideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.4}
                href="tel:+380992004080"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <PhoneIcon className="w-6 h-6" variant="secondary" /> 38 093 000
                00 00
              </motion.a>
              <motion.a
                variants={generalSlideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.5}
                href="tel:+380992004080"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <PhoneIcon className="w-6 h-6" variant="secondary" /> 38 093 000
                00 00
              </motion.a>
              <motion.a
                variants={generalSlideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.6}
                href="mailto:email@gmail.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-center gap-2 text-white leading-[130%] text-[20px] lg:text-[24px] font-semibold"
              >
                <EmailIcon className="w-6 h-6" variant="secondary" />
                hvostiki@gmail.com
              </motion.a>
            </div>
          </div>

          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.8}
            className="mt-[44px] max-w-[533px] w-full lg:w-[533px] lg:mt-0 mx-auto lg:mx-0"
          >
            <UniversalForm onSubmit={handleSubmit} {...contactConfig} />
          </motion.div>
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

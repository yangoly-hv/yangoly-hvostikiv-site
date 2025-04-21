"use client";

import UniversalForm from "@/shared/components/UniversalForm/UniversalForm";
import getContactFormConfig from "@/shared/formsConfigs/contactForm";
import { Locale } from "@/shared/types";
import { slideUp } from "@/shared/utils";
import { motion } from "framer-motion";

interface Props {
  lang: Locale;
}

const ContactForm = ({ lang }: Props) => {
  const contactConfig = getContactFormConfig(lang);

  const handleSubmit = (data: unknown) => {
    console.log("Submited:", data);
  };

  return (
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
  );
};

export default ContactForm;

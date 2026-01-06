"use client";

import {useState} from "react";
import UniversalForm from "@/shared/components/UniversalForm/UniversalForm";
import getContactFormConfig from "@/shared/formsConfigs/contactForm";
import { Locale } from "@/shared/types";
import { slideUp } from "@/shared/utils";
import { motion } from "framer-motion";
import axios from "axios";

import {ContactFormFields} from "@/shared/types";

interface Props {
  lang: Locale;
}

const ContactForm = ({ lang }: Props) => {
  const [submiteddSuccess, setSubmiteddSuccess] = useState(false);
  const contactConfig = getContactFormConfig(lang);

  const handleSubmit = async (data: ContactFormFields) => {
    try {
      await axios.post("/api/contact", {
        name: data.name,
        phone: data.phone,
        message: data.message,
      });

      setSubmiteddSuccess(true);
    } catch (error) {
      console.error("Form send error:", error);
    }
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
      {/*@ts-expect-error */}
      {!submiteddSuccess && <UniversalForm onSubmit={handleSubmit} {...contactConfig} />}
      {submiteddSuccess && (
          <h2 className="text-2xl font-bold text-center mb-[20px] text-white">
            {contactConfig.submiteddText}
          </h2>
      )}
    </motion.div>
  );
};

export default ContactForm;

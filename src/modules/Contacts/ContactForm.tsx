"use client";

import { useState } from "react";
import UniversalForm from "@/shared/components/UniversalForm/UniversalForm";
import getContactFormConfig from "@/shared/formsConfigs/contactForm";
import { ContactFormFields, Locale } from "@/shared/types";
import { slideUp } from "@/shared/utils";
import { motion } from "motion/react";
import { sendContactMessage } from "@/shared/lib/contact";

interface Props {
  lang: Locale;
}

const ContactForm = ({ lang }: Props) => {
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const contactConfig = getContactFormConfig(lang);

  const handleSubmit = async (data: ContactFormFields) => {
    setSubmitError(false);

    try {
      await sendContactMessage({
        name: data.name,
        phone: data.phone,
        message: data.message,
        requestLabel: contactConfig.requestLabel,
      });

      setSubmittedSuccess(true);
    } catch {
      setSubmitError(true);
    }
  };

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0.8}
      className="mt-[44px] max-w-[533px] w-full lg:w-[433px] xl:w-[533px] lg:mt-0 mx-auto lg:mx-0"
    >
      {!submittedSuccess && (
        <>
          <UniversalForm onSubmit={handleSubmit} {...contactConfig} />
          {submitError && (
            <p
              className="mt-3 text-center text-sm font-medium text-white"
              role="alert"
            >
              {contactConfig.submitErrorText}
            </p>
          )}
        </>
      )}
      {submittedSuccess && (
        <h2
          className="text-2xl font-bold text-center mb-[20px] text-white"
          role="status"
        >
          {contactConfig.submiteddText}
        </h2>
      )}
    </motion.div>
  );
};

export default ContactForm;

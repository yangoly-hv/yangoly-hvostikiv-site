"use client";

import { Locale } from "@/shared/types";
import { slideUp } from "@/shared/utils";
import { motion } from "motion/react";
import ContactRequestForm from "@/features/contact-request/ui/ContactRequestForm";
import { getContactRequestCopy } from "@/features/contact-request/model/copy";
import { useContactRequest } from "@/features/contact-request/model/useContactRequest";

interface Props {
  lang: Locale;
}

const ContactForm = ({ lang }: Props) => {
  const copy = getContactRequestCopy(lang, "contact-page");
  const { submittedSuccess, submitError, submit } = useContactRequest("contact-page");

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
          <div className="w-full rounded-lg bg-white p-6 shadow-sm">
            <ContactRequestForm copy={copy} onSubmit={submit} />
          </div>
          {submitError && (
            <p
              className="mt-3 text-center text-sm font-medium text-white"
              role="alert"
            >
              {copy.errorText}
            </p>
          )}
        </>
      )}
      {submittedSuccess && (
        <h2
          className="text-2xl font-bold text-center mb-[20px] text-white"
          role="status"
        >
          {copy.successText}
        </h2>
      )}
    </motion.div>
  );
};

export default ContactForm;

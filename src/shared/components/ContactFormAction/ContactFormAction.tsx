"use client";

import Button from "@/shared/components/Button/Button";
import Modal from "@/shared/components/Modal/Modal";
import UniversalForm from "@/shared/components/UniversalForm/UniversalForm";
import { ButtonVariant, ContactFormFields, Locale } from "@/shared/types";
import clsx from "clsx";
import { useState } from "react";
import getContactFormConfig from "@/shared/formsConfigs/contactForm";
import { useLocale, useTranslations } from "next-intl";
import { sendContactMessage } from "@/shared/lib/contact";

interface IContactFormActionProps {
  buttonText: string;
  variant?: ButtonVariant;
  modalTitle?: string;
  className?: string;
}

const ContactFormAction = ({
  variant = "primary",
  buttonText,
  modalTitle,
  className,
}: IContactFormActionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInstance, setFormInstance] = useState(0);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const locale = useLocale() as Locale;
  const contactConfig = getContactFormConfig(locale);
  const t = useTranslations("ContactModal");

  const resolvedModalTitle = modalTitle || t("title");

  const handleOpen = () => {
    setFormInstance((current) => current + 1);
    setSubmittedSuccess(false);
    setSubmitError(false);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSubmittedSuccess(false);
    setSubmitError(false);
  };

  const handleSubmit = async (data: ContactFormFields) => {
    setSubmitError(false);

    try {
      await sendContactMessage({
        name: data.name,
        phone: data.phone,
        message: data.message,
        requestLabel: buttonText,
      });
      setSubmittedSuccess(true);
    } catch {
      setSubmitError(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant={variant}
        className={clsx(
          "w-full py-3 text-[14px] font-semibold xl:text-[18px]",
          className
        )}
        text={buttonText}
      />
      <Modal
        modalClassName="xl:max-w-[535px] "
        isOpen={isModalOpen}
        onClose={handleClose}
      >
        <h2 className="text-[20px] lg:text-[24px] font-arial font-black mb-5 leading-[130%] text-[#1D1D1D] text-center mt-10">
          {resolvedModalTitle}
        </h2>

        {submittedSuccess ? (
          <p
            className="pb-8 text-center text-lg font-semibold text-[#1D1D1D]"
            role="status"
          >
            {contactConfig.submiteddText}
          </p>
        ) : (
          <>
            <UniversalForm
              key={formInstance}
              className="p-0"
              onSubmit={handleSubmit}
              {...contactConfig}
            />
            {submitError && (
              <p
                className="mt-3 text-center text-sm font-medium text-red-600"
                role="alert"
              >
                {contactConfig.submitErrorText}
              </p>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default ContactFormAction;

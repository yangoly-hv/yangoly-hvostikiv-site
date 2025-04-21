"use client";

import Button from "@/shared/components/Button/Button";
import Modal from "@/shared/components/Modal/Modal";
import UniversalForm from "@/shared/components/UniversalForm/UniversalForm";
import { ButtonVariant, Locale } from "@/shared/types";
import clsx from "clsx";
import { useState } from "react";
import getContactFormConfig from "@/shared/formsConfigs/contactForm";

interface IContactFormActionProps {
  lang: Locale;
  buttonText: string;
  variant?: ButtonVariant;
  modalTitle?: string;
  className?: string;
}

const ContactFormAction = ({
  variant = "primary",
  lang,
  buttonText,
  modalTitle,
  className,
}: IContactFormActionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contactConfig = getContactFormConfig(lang);

  const handleSubmit = (data: unknown) => {
    console.log("Submited:", data);
  };
  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        className={clsx(
          "w-full py-3 text-[14px] font-semibold xl:text-[18px]",
          className
        )}
        text={buttonText}
      />
      <Modal
        modalClassName="xl:max-w-[535px]"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-[24px] font-arial font-black mb-5 leading-[130%] text-[#1D1D1D] text-center mt-10">
          {modalTitle}
        </h2>

        <UniversalForm
          className="p-0"
          onSubmit={handleSubmit}
          {...contactConfig}
        />
      </Modal>
    </>
  );
};

export default ContactFormAction;

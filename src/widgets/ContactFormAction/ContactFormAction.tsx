"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import clsx from "clsx";

import Button from "@/shared/components/Button/Button";
import type { ButtonVariant } from "@/shared/types";
import type { ContactRequestSource } from "@/features/contact-request/model/schema";

const ContactRequestModal = dynamic(
  () => import("@/features/contact-request/ui/ContactRequestModal"),
  { ssr: false },
);

interface ContactFormActionProps {
  buttonText: string;
  source: ContactRequestSource;
  variant?: ButtonVariant;
  modalTitle?: string;
  className?: string;
}

export default function ContactFormAction({
  variant = "primary",
  buttonText,
  source,
  modalTitle,
  className,
}: ContactFormActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant={variant}
        className={clsx(
          "w-full py-3 text-[14px] font-semibold xl:text-[18px]",
          className,
        )}
        text={buttonText}
      />
      {isModalOpen && (
        <ContactRequestModal
          modalTitle={modalTitle}
          source={source}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

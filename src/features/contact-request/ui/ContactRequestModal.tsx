"use client";

import { useLocale, useTranslations } from "next-intl";

import { getContactRequestCopy } from "../model/copy";
import { useContactRequest } from "../model/useContactRequest";
import type { ContactRequestSource } from "../model/schema";
import type { Locale } from "@/shared/types";
import Modal from "@/shared/components/Modal/Modal";
import ContactRequestForm from "./ContactRequestForm";

type ContactRequestModalProps = {
  modalTitle?: string;
  source: ContactRequestSource;
  isOpen: boolean;
  onClose: () => void;
};

const TITLE_KEYS: Record<ContactRequestSource, string> = {
  "contact-page": "titles.contact-page",
  partnership: "titles.partnership",
  volunteering: "titles.volunteering",
  "event-partnership": "titles.event-partnership",
  "event-ambassador": "titles.event-ambassador",
  "event-volunteering": "titles.event-volunteering",
};

export default function ContactRequestModal({
  modalTitle,
  source,
  isOpen,
  onClose,
}: ContactRequestModalProps) {
  const locale = useLocale() as Locale;
  const copy = getContactRequestCopy(locale, source);
  const t = useTranslations("ContactModal");
  const { submittedSuccess, submitError, submit } = useContactRequest(source);

  const resolvedTitle = modalTitle || t(TITLE_KEYS[source] as "titles.default");

  return (
    <Modal modalClassName="xl:max-w-[535px]" isOpen={isOpen} onClose={onClose}>
      <h2 className="mt-10 mb-5 text-center font-arial text-[20px] font-black leading-[130%] text-[#1D1D1D] lg:text-[24px]">
        {resolvedTitle}
      </h2>

      {submittedSuccess ? (
        <p className="pb-8 text-center text-lg font-semibold text-[#1D1D1D]" role="status">
          {copy.successText}
        </p>
      ) : (
        <>
          <ContactRequestForm onSubmit={submit} copy={copy} />
          {submitError && (
            <p className="mt-3 text-center text-sm font-medium text-red-600" role="alert">
              {copy.errorText}
            </p>
          )}
        </>
      )}
    </Modal>
  );
}

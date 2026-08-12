"use client";

import { getEventRegistrationCopy } from "../model/copy";
import { useEventRegistration } from "../model/useEventRegistration";
import type { EventRegistrationLocale } from "../model/schema";
import EventRegistrationForm from "./EventRegistrationForm";

type EventRegistrationViewProps = {
  locale: EventRegistrationLocale;
};

export default function EventRegistrationView({ locale }: EventRegistrationViewProps) {
  const copy = getEventRegistrationCopy(locale);
  const { submittedSuccess, submitError, submit } = useEventRegistration(locale);

  return (
    <div className="mx-auto w-full max-w-[535px]">
      {submittedSuccess ? (
        <p
          className="pb-8 text-center text-lg font-semibold text-[#1D1D1D]"
          role="status"
        >
          {copy.successText}
        </p>
      ) : (
        <>
          <EventRegistrationForm onSubmit={submit} copy={copy} />
          {submitError && (
            <p className="mt-3 text-center text-sm font-medium text-red-600" role="alert">
              {copy.errorText}
            </p>
          )}
        </>
      )}
    </div>
  );
}

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
    <div className="mx-auto w-full max-w-md md:max-w-lg">
      {submittedSuccess ? (
        <p
          className="pb-4 text-center text-base font-semibold text-[#1D1D1D] md:text-lg"
          role="status"
        >
          {copy.successText}
        </p>
      ) : (
        <>
          <EventRegistrationForm onSubmit={submit} copy={copy} />
          {submitError && (
            <p className="mt-2 text-center text-sm font-medium text-red-600" role="alert">
              {copy.errorText}
            </p>
          )}
        </>
      )}
    </div>
  );
}

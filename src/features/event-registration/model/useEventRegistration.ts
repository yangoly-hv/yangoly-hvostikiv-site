"use client";

import { useCallback, useState } from "react";

import { trackCompleteRegistration } from "@/shared/lib/metaPixel";
import { submitRegistration } from "../api/submitRegistration";
import type {
  EventRegistrationFormValues,
  EventRegistrationLocale,
} from "./schema";

export function useEventRegistration(locale: EventRegistrationLocale) {
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const submit = useCallback(
    async (data: EventRegistrationFormValues) => {
      setSubmitError(false);

      try {
        const eventId = await submitRegistration({ ...data, locale });
        setSubmittedSuccess(true);
        if (eventId) {
          trackCompleteRegistration({
            eventId,
            status: true,
            email: data.email,
            phone: data.phone,
          });
        }
      } catch {
        setSubmitError(true);
      }
    },
    [locale],
  );

  const reset = useCallback(() => {
    setSubmittedSuccess(false);
    setSubmitError(false);
  }, []);

  return { submittedSuccess, submitError, submit, reset };
}

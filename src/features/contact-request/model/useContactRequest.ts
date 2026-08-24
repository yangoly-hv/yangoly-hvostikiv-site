"use client";

import { useCallback, useState } from "react";

import { trackLead } from "@/shared/lib/metaPixel";
import { sendContactMessage } from "../api/sendContactMessage";
import type { ContactRequestSource, ContactRequestValues } from "./schema";

export function useContactRequest(source: ContactRequestSource) {
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const submit = useCallback(
    async (data: ContactRequestValues) => {
      setSubmitError(false);

      try {
        const eventId = await sendContactMessage({ ...data, source });
        setSubmittedSuccess(true);
        if (eventId) trackLead({ eventId, phone: data.phone });
      } catch {
        setSubmitError(true);
      }
    },
    [source],
  );

  const reset = useCallback(() => {
    setSubmittedSuccess(false);
    setSubmitError(false);
  }, []);

  return { submittedSuccess, submitError, submit, reset };
}

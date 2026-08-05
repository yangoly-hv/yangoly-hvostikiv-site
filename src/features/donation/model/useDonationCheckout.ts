"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useReturnPath } from "@/shared/hooks/useReturnPath";
import { createCheckout } from "../api/createCheckout";
import type { DonationSchedule, DonationTarget } from "./purpose";
import { createDonationFormSchema, type DonationFormValues } from "./schema";

type UseDonationCheckoutOptions = {
  initialAmount: number;
  donationTarget?: DonationTarget;
  donationItemDescription?: string;
  agreementAcceptedByDefault?: boolean;
  donationSchedule?: DonationSchedule;
};

export function useDonationCheckout({
  initialAmount,
  donationTarget,
  donationItemDescription,
  agreementAcceptedByDefault = false,
  donationSchedule = "oneTime",
}: UseDonationCheckoutOptions) {
  const getReturnPath = useReturnPath();
  const [submitError, setSubmitError] = useState(false);
  const form = useForm<DonationFormValues>({
    defaultValues: {
      amount: initialAmount,
      fullName: "",
      isAnonymous: false,
      comment: "",
      isAgreed: agreementAcceptedByDefault,
      donationSchedule,
      isRecurringAgreed: false,
    },
    mode: "onChange",
    resolver: zodResolver(createDonationFormSchema()),
  });

  const submit = form.handleSubmit(
    useCallback(
      async ({
        amount,
        fullName,
        isAnonymous,
        comment,
        isAgreed,
        donationSchedule,
        isRecurringAgreed,
      }) => {
        setSubmitError(false);

        try {
          await createCheckout({
            amount,
            donationTarget,
            donationItemDescription,
            fullName: isAnonymous ? undefined : fullName,
            isAnonymous,
            comment,
            isAgreed,
            donationSchedule,
            isRecurringAgreed,
            returnPath: getReturnPath(),
          });
        } catch {
          setSubmitError(true);
        }
      },
      [donationItemDescription, donationTarget, getReturnPath],
    ),
  );

  return { ...form, submit, submitError };
}

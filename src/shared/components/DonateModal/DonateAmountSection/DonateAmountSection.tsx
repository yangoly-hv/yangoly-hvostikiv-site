"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import CustomAmountCard from "../CustomAmountCard/CustomAmountCard";
import AmountCard from "../AmountCard/AmountCard";
import TextInput from "../../TextInput/TextInput";
import CheckBox from "../../CheckBox/CheckBox";
import PaymentButton from "../PaymentButton/PaymentButton";
import Toast from "../../Toast/Toast";
import PublicOfferLink from "@/shared/components/PublicOfferLink/PublicOfferLink";
import { formatAmount } from "@/shared/utils";

import donate from "@/shared/lib/donate";

const predefinedAmounts = [200, 500, 1000];

const DonateAmountSection = () => {
  const t = useTranslations("DonateModal");

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const returnPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const translation = {
    title: t("donateAmountSection.title"),
    anotherAmount: t("donateAmountSection.anotherAmount"),
    inputPlaceholder: t("donateAmountSection.inputPlaceholder"),
    inputLabel: t("donateAmountSection.inputLabel"),
    firstCheckboxLabel: t("donateAmountSection.firstCheckboxLabel"),
    secondCheckboxLabel: t("donateAmountSection.secondCheckboxLabel"),
    submitError: t("donateAmountSection.submitError"),
    currency: t("currency"),
  };

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [comment, setComment] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [wantNotifications, setWantNotifications] = useState(false);
  const [agreementError, setAgreementError] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (isAgreed) {
      setAgreementError(false);
    }
  }, [isAgreed]);

  const handleAmountSelect = useCallback((amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  }, []);

  const handleCustomAmountChange = useCallback((value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  }, []);

  const handleCustomAmountFocus = useCallback(() => {
    setSelectedAmount(null);
  }, []);

  const currentAmount =
      selectedAmount || (customAmount ? parseInt(customAmount, 10) : 0);

  const handlePayment = async () => {
    if (!isAgreed) {
      setAgreementError(true);
      return;
    }
    await donate({amount: currentAmount, comment, returnPath});
    // try {
    //   const { data } = await axios.post("/api/wayforpay/checkout", {
    //     amount: currentAmount,
    //     orderReference: `DONATE_${Date.now()}`,
    //     productName: "Донат для фонду Янголи хвостиків",
    //     comment,
    //     returnPath,
    //   });
    //
    //   const form = document.createElement("form");
    //   form.method = "POST";
    //   form.action = "https://secure.wayforpay.com/pay";
    //
    //   Object.entries(data).forEach(([key, value]) => {
    //     const input = document.createElement("input");
    //     input.type = "hidden";
    //     input.name = key;
    //     input.value = Array.isArray(value) ? value.join(";") : String(value);
    //     form.appendChild(input);
    //   });
    //
    //   document.body.appendChild(form);
    //   form.submit();
    // } catch (error) {
    //   console.error("WayForPay checkout error:", error);
    //   // setIsToastVisible(true);
    // }
  };

  return (
      <>
        <div className="flex relative flex-col items-center gap-4 py-4">
          <div className="border border-[#FF9332] max-w-[350px] xl:max-w-[544px] p-3 xl:p-6 w-full">
            <p className="text-center text-[20px] font-black font-arial text-dark uppercase leading-[130%] mb-2">
              {translation.title}
            </p>

            <p className="text-center text-[24px] xl:text-[32px] leading-[130%] text-[#52525B] mb-2">
              {formatAmount(currentAmount)} {translation.currency}
            </p>

            <div className="grid grid-cols-3 gap-2 max-w-[400px] xl:max-w-[544px] mx-auto">
              {predefinedAmounts.map((amount) => (
                  <AmountCard
                      key={amount}
                      amount={amount}
                      formattedAmount={formatAmount(amount)}
                      currency={translation.currency}
                      isSelected={selectedAmount === amount}
                      onClick={handleAmountSelect}
                  />
              ))}

              <div className="col-start-1">
                <CustomAmountCard
                    anotherAmount={translation.anotherAmount}
                    currency={translation.currency}
                    value={customAmount}
                    formatAmount={formatAmount}
                    isSelected={selectedAmount === null && customAmount !== ""}
                    onChange={handleCustomAmountChange}
                    onFocus={handleCustomAmountFocus}
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[350px] xl:max-w-[544px]">
            <TextInput
                value={comment}
                onChange={setComment}
                placeholder={translation.inputPlaceholder}
                label={translation.inputLabel}
            />

            <div className="space-y-3 mb-4">
              <CheckBox
                  label={translation.firstCheckboxLabel}
                  checked={wantNotifications}
                  onChange={setWantNotifications}
              />

              <CheckBox
                  label={<PublicOfferLink text={translation.secondCheckboxLabel} />}
                  checked={isAgreed}
                  onChange={setIsAgreed}
                  error={agreementError}
                  required
              />
            </div>

            <div className="space-y-2 mb-2">
              <PaymentButton
                  disabled={!isAgreed || currentAmount <= 0}
                  paymentType="monoPay"
                  onClick={handlePayment}
              />
              {/* <PaymentButton paymentType="googlePay" onClick={handlePayment} /> */}
            </div>
          </div>
        </div>

        {isToastVisible && (
            <Toast
                message={translation.submitError}
                isVisible={isToastVisible}
                onClose={() => setIsToastVisible(false)}
            />
        )}
      </>
  );
};

export default React.memo(DonateAmountSection);

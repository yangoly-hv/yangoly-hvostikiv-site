"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
// import CustomAmountCard from "../CustomAmountCard/CustomAmountCard";
// import AmountCard from "../AmountCard/AmountCard";
import { formatAmount } from "@/shared/utils";
import TextInput from "../../TextInput/TextInput";
import CheckBox from "../../CheckBox/CheckBox";
import PaymentButton from "../PaymentButton/PaymentButton";
import Toast from "../../Toast/Toast";
import ThankYouModal from "../ThankYouModal/ThankYouModal";
import { useTranslations } from "next-intl";

import PublicOfferLink from "@/shared/components/PublicOfferLink/PublicOfferLink";

// const predefinedAmounts = [200, 500, 1000];

const DonateAmountSection = ({price}: {price: number}) => {
  const t = useTranslations("DonateModal");
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentData, setPaymentData] = useState({
    orderReference: 'ORDER-123456',
    orderDate: Math.floor(Date.now() / 1000),
    amount: '100.00',
    currency: 'UAH',
    productName: `Donate to the fund's work`,
    productCount: '1',
    productPrice: '100.00',
    merchantAccount: "",
    merchantDomainName: "",
    signature: "",
  });

  const translation = {
    title: t("donateAmountSection.title"),
    anotherAmount: t("donateAmountSection.anotherAmount"),
    inputPlaceholder: t("donateAmountSection.inputPlaceholder"),
    inputLabel: t("donateAmountSection.inputLabel"),
    firstCheckboxLabel: t("donateAmountSection.firstCheckboxLabel"),
    secondCheckboxLabel: t("donateAmountSection.secondCheckboxLabel"),
    submitError: t("donateAmountSection.submitError"),
  };

  const [selectedAmount, setSelectedAmount] = useState<number>(price);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [comment, setComment] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [wantNotifications, setWantNotifications] = useState(false);
  const [agreementError, setAgreementError] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  useEffect(() => {
    const fetchPaymentData = async()=> {
      try {
          const {data} = await axios.post("/api/wayforpay-signature", paymentData);
          setPaymentData(data.paymentData);
      }
      catch(error) {
         console.log(error);
      }
    }
    // fetchPaymentData();
  }, []);

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
    //setSelectedAmount(null);
  }, []);

  const handleCustomAmountFocus = useCallback(() => {
    //setSelectedAmount(null);
  }, []);

  const currentAmount =
    selectedAmount || (customAmount ? parseInt(customAmount) : 0);

  const handlePayment = async () => {
    const {data} = await axios.post("/api/wayforpay/checkout", {
      amount: currentAmount,
      orderReference: `DONATE_${Date.now()}`,
      productName: "Донат для фонду Янголи хвостиків",
    });

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://secure.wayforpay.com/pay";

    Object.keys(data).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = Array.isArray(data[key]) ? data[key].join(";") : data[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    // console.log({
    //   amount: currentAmount,
    //   comment,
    //   wantNotifications,
    //   isAgreed,
    // });

    // setIsThankYouModalOpen(true);
  };

  return (
    <>
      <div className="flex relative flex-col items-center gap-4 py-4">
        <div className="border border-[#FF9332] max-w-[350px] xl:max-w-[544px] p-3 xl:p-6 w-full">
          <p className="text-center text-[20px] font-black font-arial text-dark uppercase leading-[130%] mb-2">
            {translation.title}
          </p>
          <p className="text-center text-[24px] xl:text-[32px] leading-[130%] text-[#52525B] mb-2">
            {formatAmount(currentAmount)} {t("currency")}
          </p>
          {/*<div className="grid grid-cols-3 gap-2 max-w-[400px] xl:max-w-[544px] mx-auto">*/}
          {/*  {predefinedAmounts.map((amount) => (*/}
          {/*    <AmountCard*/}
          {/*      currency={t("currency")}*/}
          {/*      key={amount}*/}
          {/*      amount={amount}*/}
          {/*      formattedAmount={formatAmount(amount)}*/}
          {/*      isSelected={selectedAmount === amount}*/}
          {/*      onClick={handleAmountSelect}*/}
          {/*    />*/}
          {/*  ))}*/}
          {/*  <div className="col-start-1">*/}
          {/*    <CustomAmountCard*/}
          {/*      anotherAmount={translation.anotherAmount}*/}
          {/*      currency={t("currency")}*/}
          {/*      value={customAmount}*/}
          {/*      formatAmount={formatAmount}*/}
          {/*      isSelected={selectedAmount === null && customAmount !== ""}*/}
          {/*      onChange={handleCustomAmountChange}*/}
          {/*      onFocus={handleCustomAmountFocus}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
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
              onChange={(checked) => setWantNotifications(checked)}
            />
            <CheckBox
              label={<PublicOfferLink text={translation.secondCheckboxLabel} />}
              checked={isAgreed}
              onChange={(checked) => setIsAgreed(checked)}
              error={agreementError}
              required
            />
          </div>

          <div className="space-y-2 mb-2">
            <PaymentButton paymentType="monoPay" onClick={handlePayment}/>
            {/*<PaymentButton paymentType="googlePay" onClick={handlePayment} />*/}
          </div>
        </div>
      </div>

      <ThankYouModal
          isOpen={isThankYouModalOpen}
          onClose={() => setIsThankYouModalOpen(false)}
      />

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

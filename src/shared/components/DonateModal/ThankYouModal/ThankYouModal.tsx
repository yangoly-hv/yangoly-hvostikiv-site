"use client";
import Button from "../../Button/Button";
import { CloseIcon } from "../../../../../public/images/icons";
import { IThankYouModalProps } from "@/shared/types";
import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import SafeImage from "@/shared/components/SafeImage/SafeImage";
const ThankYouModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText,
  onButtonClick,
}: IThankYouModalProps) => {
  const t = useTranslations("ThankYouModal");
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus(); };
  }, [isOpen, onClose]);
  const handleButtonClick = useCallback(() => {
    onButtonClick?.();
    onClose();
  }, [onButtonClick, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="payment-result-title" tabIndex={-1} className="bg-white  max-w-md w-full mx-4 py-[20px] relative">
        <button
          onClick={onClose}
          aria-label="Закрити повідомлення"
          className="absolute hover:bg-gray-100 rounded-full p-2 top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <CloseIcon variant="secondary" />
        </button>
        <div className="flex pl-5 justify-start gap-[14px] items-baseline">
          <SafeImage
            src="/images/cartoon-cat.png"
            alt="Cartoon cat"
            width={35}
            height={32}
          />
          <h2 id="payment-result-title" className="text-2xl font-bold text-center mb-[20px]">
            {title ? title : t("title")}
          </h2>
        </div>
        <div className="w-full h-px bg-gray-300"></div>
        <div className="px-[20px]">
          <p className="text-start text-black py-[10px]   text-[18px] mb-6">
            {message ? message : t("message")}
          </p>

          <div className="flex justify-end">
            <Button
              onClick={handleButtonClick}
              text={buttonText ? buttonText : t("buttonText")}
              variant="secondary"
              className="py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;

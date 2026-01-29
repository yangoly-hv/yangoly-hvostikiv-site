"use client";
import Button from "@/shared/components/Button/Button";
// import DonateModal from "@/shared/components/DonateModal/DonateModal";
import { ButtonVariant } from "@/shared/types";
import clsx from "clsx";
// import { useState } from "react";
import { useTranslations } from "next-intl";

import {useModal} from "@/providers/ModalProvider";

interface IDonateActionProps {
  buttonText: string;
  color?: string;
  variant?: ButtonVariant;
  className?: string;
}

const DonateAction = ({
  variant = "secondary",
  color,
  buttonText,
  className,
}: IDonateActionProps) => {
  // const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const t = useTranslations("DonateModal");

    const {openDonateModal} = useModal();

  return (
    <>
      <Button
        onClick={() => openDonateModal(t("fundraisingOneTimeTitle"))}
        variant={variant}
        className={clsx(
          "mx-auto w-full max-w-[300px] py-3 text-[14px] font-semibold xl:text-[18px] xl:max-w-[383px] mt-[2px] flex justify-center items-center",
          color,
          className
        )}
        text={buttonText}
      />
      {/*<DonateModal*/}
      {/*    title={t("fundraisingOneTimeTitle")}*/}
      {/*  isOpen={isDonateModalOpen}*/}
      {/*  onClose={() => setIsDonateModalOpen(false)}*/}
      {/*/>*/}
    </>
  );
};

export default DonateAction;

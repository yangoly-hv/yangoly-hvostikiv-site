"use client";

import Button from "@/shared/components/Button/Button";
import DonateModal from "@/shared/components/DonateModal/DonateModal";
import { ButtonVariant } from "@/shared/types";
import clsx from "clsx";
import { useState } from "react";
interface IDonateActionProps {
  buttonText: string;
  color?: string;
  variant?: ButtonVariant;
}

const DonateAction = ({
  variant = "secondary",
  color,
  buttonText,
}: IDonateActionProps) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDonateModalOpen(true)}
        variant={variant}
        className={clsx(
          "mx-auto w-full max-w-[300px] py-3 text-[14px] font-semibold xl:text-[18px] xl:max-w-[383px] mt-[2px] flex justify-center",
          color
        )}
        text={buttonText}
      />
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </>
  );
};

export default DonateAction;

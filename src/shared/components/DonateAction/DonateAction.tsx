"use client";
import Button from "@/shared/components/Button/Button";
import { ButtonVariant } from "@/shared/types";
import clsx from "clsx";

import { useOneTimeDonationJarUrl } from "@/providers/OneTimeDonationJarProvider";
import { trackMonoDonateClick } from "@/shared/lib/metaPixel";

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
  const jarUrl = useOneTimeDonationJarUrl();
  if (!jarUrl) return null;

  return (
    <Button
      href={jarUrl}
      variant={variant}
      onClick={trackMonoDonateClick}
      className={clsx(
        "mx-auto w-full max-w-[300px] py-3 text-[14px] font-semibold xl:text-[18px] xl:max-w-[383px] mt-[2px] flex justify-center items-center",
        color,
        className
      )}
      text={buttonText}
    />
  );
};

export default DonateAction;

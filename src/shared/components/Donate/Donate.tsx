"use client";
import { IDonateProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import Button from "@/shared/components/Button/Button";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

import {useModal} from "@/providers/ModalProvider";

export default function Donate({
    title,
  donationTarget,
  buttonText,
  className = "",
}: IDonateProps) {
  const { openDonateModal } = useModal();

  return (
    <>
      <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
        <Button
          onClick={() => openDonateModal(title, donationTarget)}
          text={buttonText}
          className={className}
        ></Button>
      </AnimatedWrapper>
    </>
  );
}

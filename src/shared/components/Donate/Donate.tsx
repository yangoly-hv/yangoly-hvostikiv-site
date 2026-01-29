"use client";
// import { useState, useCallback } from "react";
import { IDonateProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
// import DonateModal from "@/shared/components/DonateModal/DonateModal";
import Button from "@/shared/components/Button/Button";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

import {useModal} from "@/providers/ModalProvider";

export default function Donate({
    title,
  buttonText,
  className = "",
}: IDonateProps) {
  // const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const { openDonateModal } = useModal();
  //
  // const handleCloseModal = useCallback(() => {
  //   setIsDonateModalOpen(false);
  // }, []);

  return (
    <>
      <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
        <Button
          onClick={() => openDonateModal(title)}
          text={buttonText}
          className={className}
        ></Button>
      </AnimatedWrapper>
      {/*<DonateModal*/}
      {/*    title="Збору на"*/}
      {/*  isOpen={isDonateModalOpen}*/}
      {/*  onClose={handleCloseModal}*/}
      {/*/>*/}
    </>
  );
}

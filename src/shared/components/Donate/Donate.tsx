"use client";
import { useState, useCallback } from "react";
import { IDonateProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import DonateModal from "@/shared/components/DonateModal/DonateModal";
import Button from "@/shared/components/Button/Button";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

export default function Donate({
  buttonText,
  className = "",
}: IDonateProps) {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsDonateModalOpen(false);
  }, []);

  return (
    <>
      <AnimatedWrapper animation={fadeInAnimation({ y: 30, delay: 0.4 })}>
        <Button
          onClick={() => setIsDonateModalOpen(true)}
          text={buttonText}
          className={className}
        ></Button>
      </AnimatedWrapper>
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

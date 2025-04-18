"use client";
import { useState, useCallback } from "react";
import { IDonateProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import DonateModal from "@/shared/components/DonateModal/DonateModal";
import Button from "@/shared/components/Button/Button";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";

export default function Donate({
  makeContribution,
  donateModalTranslataion,
  lang,
}: IDonateProps) {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleCloseModal = useCallback(() => {
    setIsDonateModalOpen(false);
  }, []);

  return (
    <>
      <AnimatedWrapper animation={fadeInAnimation({ y: 30 })}>
        <Button
          onClick={() => setIsDonateModalOpen(true)}
          text={makeContribution}
          className="w-full md:w-[297px] lg:w-[397px] xl:w-[607px] xl:h-[67px]"
        ></Button>
      </AnimatedWrapper>
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={handleCloseModal}
        translation={donateModalTranslataion}
        lang={lang}
      />
    </>
  );
}

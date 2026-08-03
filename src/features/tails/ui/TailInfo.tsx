"use client";

import { useState } from "react";
import { motion } from "motion/react";

import AdoptModal from "@/shared/components/AdoptModal/AdoptModal";
import Button from "@/shared/components/Button/Button";
import ImageSlider from "@/shared/components/ImageSlider/ImageSlider";
import KeepingModal from "@/shared/components/KeepingModal/KeepingModal";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import type { ITails } from "@/shared/types";
import { fadeIn } from "@/shared/utils";
import { useModal } from "@/providers/ModalProvider";
import type { TailViewModel } from "../model/types";

const TailInfo = ({
  tail,
  translation,
}: {
  tail: TailViewModel;
  translation: ITails;
}) => {
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isKeepingModalOpen, setIsKeepingModalOpen] = useState(false);
  const { openDonateModal } = useModal();
  const {
    adoptButton,
    oneTimeHelpButton,
    becomeGuardianButton,
    supportText,
  } = translation;
  const needsFamily = tail.categories.includes("needs-family");

  return (
    <div className="flex flex-col items-center lg:flex-row gap-y-7 lg:gap-y-0 lg:bg-white">
      {tail.galleryImages.length > 0 && (
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <ImageSlider images={tail.galleryImages} />
        </motion.div>
      )}
      <div className="flex flex-col justify-center w-full max-w-[706px] lg:max-w-full p-6 lg:px-[76px] bg-white rounded-[12px] lg:rounded-none">
        <motion.h2 variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2} className="mb-4 lg:mb-5 font-arial font-black text-black text-[24px] lg:text-[32px] leading-[130%]">
          {tail.name}
        </motion.h2>

        <div className="flex flex-col gap-4">
          <PortableTextRenderer value={tail.description} />
        </div>
        <div className="flex flex-col mt-7 lg:mt-8 gap-2">
          {needsFamily && (
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.8}>
              <Button onClick={() => setIsAdoptModalOpen(true)} text={adoptButton} fullWidth className="max-w-[404px] lg:w-[313px] mx-auto lg:mx-0" />
            </motion.div>
          )}
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <Button onClick={() => openDonateModal(supportText)} variant="outline" text={oneTimeHelpButton} fullWidth className="max-w-[404px] lg:w-[313px] mx-auto lg:mx-0" />
          </motion.div>
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <Button onClick={() => setIsKeepingModalOpen(true)} variant="outline" text={becomeGuardianButton} fullWidth className="max-w-[404px] lg:w-[313px] mx-auto lg:mx-0" />
          </motion.div>
        </div>
      </div>
      <AdoptModal isOpen={isAdoptModalOpen} onClose={() => setIsAdoptModalOpen(false)} translation={translation} />
      <KeepingModal price={tail.keeping_price} isOpen={isKeepingModalOpen} onClose={() => setIsKeepingModalOpen(false)} />
    </div>
  );
};

export default TailInfo;

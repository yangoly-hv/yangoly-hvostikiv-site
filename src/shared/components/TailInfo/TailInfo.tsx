"use client";
import { useState } from "react";
import ImageSlider from "../ImageSlider/ImageSlider";
import Button from "../Button/Button";
import AdoptModal from "../AdoptModal/AdoptModal";
// import DonateModal from "../DonateModal/DonateModal";
import KeepingModal from "@/shared/components/KeepingModal/KeepingModal";
import { motion } from "framer-motion";
import { fadeIn } from "@/shared/utils";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";

import {useModal} from "@/providers/ModalProvider";

//@ts-expect-error
const TailInfo = ({ tail, translation }) => {
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isKeepingModalOpen, setIsKeepingModalOpen] = useState(false);

  const {openDonateModal} = useModal();

  const { adoptButton, oneTimeHelpButton, becomeGuardianButton, sterilize } = translation;

  const handleAdoptModalClose = () => {
    setIsAdoptModalOpen(false);
  };

  const handleDonateModalClose = () => {
    setIsDonateModalOpen(false);
  };

  const handleKeepingModalClose = () => {
    setIsKeepingModalOpen(false);
  };

  const needsFamily = tail.categories.find(
      //@ts-expect-error
      (category) => category === "needs-family"
  );

  const { supportText } = translation;

  return (
    <div className="flex flex-col items-center lg:flex-row gap-y-7 lg:gap-y-0 lg:bg-white">
      {Boolean(tail?.images?.length) && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <ImageSlider images={tail.images} />
        </motion.div>
      )}
      <div className="flex flex-col justify-center w-full max-w-[706px] lg:max-w-full p-6 lg:px-[76px] bg-white rounded-[12px] lg:rounded-none">
        <motion.h2
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0.2}
          className="mb-4 lg:mb-5 font-arial font-black text-black text-[24px] lg:text-[32px] leading-[130%]"
        >
          {tail.name}
        </motion.h2>

        <div
          className="flex flex-col gap-4"
          // dangerouslySetInnerHTML={{ __html: tail.mainText }}
        >
          <PortableTextRenderer value={tail.description} />
          {/*{tail.description.map((descr, index) => (*/}
          {/*  <motion.p*/}
          {/*    variants={generalSlideUp}*/}
          {/*    initial="hidden"*/}
          {/*    whileInView="visible"*/}
          {/*    viewport={{ once: true }}*/}
          {/*    custom={0.4 + index * 0.2}*/}
          {/*    className="text-[14px] text-dark lg:text-[16px] leading-[130%]"*/}
          {/*    key={index}*/}
          {/*  >*/}
          {/*    {descr}*/}
          {/*  </motion.p>*/}
          {/*))}*/}
        </div>
        <div className="flex flex-col mt-7 lg:mt-8 gap-2">
          {needsFamily && (
              <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{once: true}}
                  custom={0.8}
              >
                <Button
                    onClick={() => setIsAdoptModalOpen(true)}
                    text={adoptButton}
                    fullWidth
                    className="max-w-[404px] lg:w-[313px] mx-auto lg:mx-0"
                />
              </motion.div>
          )}
          {/*{needsSterilization && <motion.div*/}
          {/*    variants={fadeIn}*/}
          {/*    initial="hidden"*/}
          {/*    whileInView="visible"*/}
          {/*    viewport={{once: true}}*/}
          {/*    custom={1.0}*/}
          {/*>*/}
          {/*  <Button*/}
          {/*      onClick={() => setIsSterilizationModalOpen(true)}*/}
          {/*      variant="outline"*/}
          {/*      text={sterilize}*/}
          {/*      fullWidth*/}
          {/*      className="max-w-[404px] lg:w-[313px] mx-auto lg:mx-0"*/}
          {/*  />*/}
          {/*</motion.div>}*/}
          <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true}}
              custom={1.0}
          >
            <Button
                onClick={() => openDonateModal(supportText)}
                variant="outline"
                text={oneTimeHelpButton}
                fullWidth
                className="max-w-[404px] lg:w-[313px] mx-auto lg:mx-0"
            />
          </motion.div>
          <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{once: true}}
              custom={1.0}
          >
            <Button
                onClick={() => setIsKeepingModalOpen(true)}
                variant="outline"
                text={becomeGuardianButton}
                fullWidth
                className="max-w-[404px] lg:w-[313px] mx-auto lg:mx-0"
            />
          </motion.div>
        </div>
      </div>
      <AdoptModal
          isOpen={isAdoptModalOpen}
          onClose={handleAdoptModalClose}
          translation={translation}
      />
      {/*<DonateModal*/}
      {/*    isOpen={isDonateModalOpen}*/}
      {/*    onClose={handleDonateModalClose}*/}
      {/*/>*/}
      <KeepingModal
          //@ts-expect-error
          price={tail.keeping_price}
          isOpen={isKeepingModalOpen}
          onClose={handleKeepingModalClose}
      />
    </div>
  );
};

export default TailInfo;

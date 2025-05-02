"use client";
import { useState } from "react";
import ImageSlider from "../ImageSlider/ImageSlider";
import Button from "../Button/Button";
import AdoptModal from "../AdoptModal/AdoptModal";
import DonateModal from "../DonateModal/DonateModal";
import { motion } from "framer-motion";
import { fadeIn } from "@/shared/utils";

//@ts-expect-error
const TailInfo = ({ tail, locale, translation }) => {
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const { adoptButton, oneTimeHelpButton, sterilize } = translation;

  const handleAdoptModalClose = () => {
    setIsAdoptModalOpen(false);
  };

  const handleDoanteModalClose = () => {
    setIsDonateModalOpen(false);
  };

  const needsSterilization = tail.categories.find(
    //@ts-expect-error
    (category) => category === "needs-sterilization"
  );

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
          dangerouslySetInnerHTML={{ __html: tail.mainText }}
        >
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
          {tail.categories.includes("needs-family") && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
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
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1.0}
          >
            <Button
              onClick={() => setIsDonateModalOpen(true)}
              variant="outline"
              text={needsSterilization ? sterilize : oneTimeHelpButton}
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
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={handleDoanteModalClose}
      />
    </div>
  );
};

export default TailInfo;

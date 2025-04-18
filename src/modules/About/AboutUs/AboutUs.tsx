"use client";
import Button from "@/shared/components/Button/Button";
import ImageGallery from "@/shared/components/ImageGallery/ImageGallery";
import InfoBlock from "@/shared/components/InfoBlock/InfoBlock";
import Modal from "@/shared/components/Modal/Modal";
import UniversalForm from "@/shared/components/UniversalForm/UniversalForm";
import getContactFormConfig from "@/shared/formsConfigs/contactForm";
import { IInformationBlockTranslation, Locale } from "@/shared/types";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { generalSlideUp } from "@/shared/utils";
import Image from "next/image";

const aboutImages = [
  {
    src: "/images/about/about-us-desk1.webp",
    alt: "Owner with pets showing foundation logo",
  },
  {
    src: "/images/about/about-us-desk2.webp",
    alt: "Pet drawing with paw",
  },
  {
    src: "/images/about/about-us-desk3.webp",
    alt: "Team members with pets",
  },
];

const aboutMobImages = [
  {
    src: "/images/about/about-us-mob1.webp",
    alt: "Owner with pets showing foundation logo",
  },
  {
    src: "/images/about/about-us-mob2.webp",
    alt: "Owner with pets showing foundation logo",
  },
  {
    src: "/images/about/about-us-mob3.webp",
    alt: "Owner with pets showing foundation logo",
  },
];

const AboutUs = ({
  translation,
}: {
  translation: IInformationBlockTranslation;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const pathName = usePathname();
  const lang = pathName?.split("/")[1] as Locale;

  const contactConfig = getContactFormConfig(lang);

  const handleSubmit = (data: unknown) => {
    console.log("Submited:", data);
  };

  const modalTitle =
    lang === "uk"
      ? "Щоб стати нашим партнером, залиште ваші контактні дані"
      : "To become our partner, leave your contact details";

  return (
    <div className="xl:grid xl:grid-cols-2 pb-[40px]">
      <div className="hidden xl:block">
        <ImageGallery images={aboutImages} className="" variant="splitLayout" />
      </div>
      <InfoBlock
        titleClassName="xl:mb-[48px]"
        className="py-[40px] px-[30px]  rounded-[20px] flex flex-col h-full  justify-center xl:px-[50px] 2xl:px-[93px] xl:py-[108px]"
        translation={translation}
      >
        <motion.div
          className="flex flex-col md:flex-row md:gap-4 mt-[24px] xl:mt-[32px] w-full gap-4 xl:flex-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={generalSlideUp} custom={0.2}>
            <Button
              className="w-full"
              onClick={handleOpenModal}
              text={translation.links![0].text}
            />
          </motion.div>
          <motion.div variants={generalSlideUp} custom={0.4}>
            <Button
              className="w-full"
              variant="outline"
              text={translation.links![1].text}
            />
          </motion.div>
        </motion.div>
      </InfoBlock>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 xl:hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {aboutMobImages.map((image, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={generalSlideUp}
            custom={0.2 + index * 0.2}
            className="relative w-full aspect-[328/268] rounded-[16px] overflow-hidden"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={75}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-[16px]"
            />
          </motion.div>
        ))}
      </motion.div>
      <Modal
        modalClassName="xl:max-w-[535px]"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <h2 className="text-[20px] xl:text-[24px] uppercase leading-[160%] font-arial mb-[20px] text-[#1D1D1D] text-center mt-10">
          {modalTitle}
        </h2>
        <UniversalForm
          className="p-0"
          onSubmit={handleSubmit}
          {...contactConfig}
        />
      </Modal>
    </div>
  );
};

export default AboutUs;

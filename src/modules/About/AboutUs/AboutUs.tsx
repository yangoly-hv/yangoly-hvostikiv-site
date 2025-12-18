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
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import { listVariants } from "@/shared/components/Animations/animationVariants";
import Link from "next/link";

import {useWindowWidth} from "@/shared/hooks/useWindowWidth";

// const aboutImages = [
//   {
//     src: "/images/about/about-us-desk1.webp",
//     alt: "Owner with pets showing foundation logo",
//   },
//   {
//     src: "/images/about/about-us-desk2.webp",
//     alt: "Pet drawing with paw",
//   },
//   {
//     src: "/images/about/about-us-desk3.webp",
//     alt: "Team members with pets",
//   },
// ];
//
// const aboutMobImages = [
//   {
//     src: "/images/about/about-us-mob1.webp",
//     alt: "Owner with pets showing foundation logo",
//   },
//   {
//     src: "/images/about/about-us-mob2.webp",
//     alt: "Owner with pets showing foundation logo",
//   },
//   {
//     src: "/images/about/about-us-mob3.webp",
//     alt: "Owner with pets showing foundation logo",
//   },
// ];

const AboutUs = ({
  translation,
    // @ts-expect-error
    about,
}: {
  translation: IInformationBlockTranslation;
}) => {
  // const { modalTitle } = translation;
    const windowWidth = useWindowWidth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const pathName = usePathname();
  const lang = pathName?.split("/")[1] as Locale;

  const contactConfig = getContactFormConfig(lang);

  const handleSubmit = (data: unknown) => {
    console.log("Submited:", data);
  };

    let aboutImages = [];
  if(windowWidth < 768) {
       aboutImages = about.imagesMobile.map((src: string) => ({
          src,
          alt: about.title
      }));
  }
  else {
      aboutImages = about.imagesDesktop.map((src: string) => ({
          src,
          alt: about.title
      }));
  }
    console.log(aboutImages)
  //@ts-expect-error
  const paragraphs = about.description.map(({children}) => ({segments: [{text: children[0].text, bold: false}]}));

  return (
    <div className="lg:grid lg:grid-cols-2 pb-[40px]">
      <div className="hidden lg:block">
        <ImageGallery images={aboutImages} className="" variant="splitLayout" />
      </div>
      <InfoBlock
        titleClassName="xl:mb-[48px]"
        className="py-[40px] px-[30px]  rounded-[20px] flex flex-col h-full  justify-center laptop:px-[75px] xl:py-[74px]"
        translation={{title: about.title, paragraphs}}
      >
        <motion.div
          className="flex flex-col md:flex-row md:gap-4 mt-[24px] xl:mt-[32px] w-full gap-4 xl:flex-row"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={generalSlideUp} custom={0.8}>
            <Button
              className="w-full"
              onClick={handleOpenModal}
              text={translation.links![0].text}
            />
          </motion.div>
          <motion.div variants={generalSlideUp} custom={1}>
              <Link href="/reporting" className="block w-full">
            <Button
              className="w-full"
              variant="outline"
              text={translation.links![1].text}
            />
              </Link>
          </motion.div>
        </motion.div>
      </InfoBlock>
      <AnimatedWrapper
        as="div"
        animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 lg:hidden"
      >
        {/*@ts-expect-error*/}
        {aboutImages.map((image, index) => (
          <AnimatedWrapper
            as="div"
            key={index}
            viewport={{ once: true }}
            className={`relative w-full aspect-[328/268] rounded-[16px] overflow-hidden ${
              index === 0 ? "md:row-span-2 md:h-full" : "md:row-span-1"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={75}
              sizes="(max-width: 1024px) 100vw 50vw"
              className=" object-center rounded-[16px]"
            />
          </AnimatedWrapper>
        ))}
      </AnimatedWrapper>
      <Modal
        modalClassName="xl:max-w-[535px]"
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <h2 className="text-[20px] xl:text-[24px] uppercase leading-[160%] font-arial mb-[20px] text-[#1D1D1D] text-center mt-10">
          {about.title}
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

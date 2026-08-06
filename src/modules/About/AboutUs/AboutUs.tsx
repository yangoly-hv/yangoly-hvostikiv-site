import Image from "next/image";
import * as motion from "motion/react-client";

import type { AboutFoundation } from "@/features/home/model/types";
import { Link } from "@/i18n/navigation";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import { listVariants } from "@/shared/components/Animations/animationVariants";
import Button from "@/shared/components/Button/Button";
import ImageGallery from "@/shared/components/ImageGallery/ImageGallery";
import InfoBlock from "@/shared/components/InfoBlock/InfoBlock";
import type { IInformationBlockTranslation } from "@/shared/types";
import { generalSlideUpAt } from "@/shared/utils";

const AboutUs = ({
  translation,
  about,
}: {
  translation: IInformationBlockTranslation;
  about: AboutFoundation;
}) => {
  const desktopImages = about.imagesDesktop.map((src) => ({
    src,
    alt: about.title,
  }));
  const mobileImages = about.imagesMobile.map((src) => ({
    src,
    alt: about.title,
  }));

  return (
    <div className="lg:grid lg:grid-cols-2 pb-[40px]">
      <div className="hidden lg:block">
        <ImageGallery images={desktopImages} variant="splitLayout" />
      </div>
      <InfoBlock
        titleClassName="xl:mb-[48px]"
        className="p-[30px] rounded-[20px] flex flex-col h-full justify-center xl:p-[93px]"
        translation={{ title: translation.title, paragraphs: [] }}
        blocks={about.description}
      >
        <motion.div className="flex flex-col md:flex-row md:gap-4 mt-[24px] xl:mt-[32px] w-full gap-4 xl:flex-row" initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={generalSlideUpAt(0.8)}>
            <Link href="/partnership" className="block w-full">
              <Button className="w-full" text={translation.links?.[0]?.text || ""} />
            </Link>
          </motion.div>
          <motion.div variants={generalSlideUpAt(1)}>
            <Link href="/reporting" className="block w-full">
              <Button className="w-full" variant="outline" text={translation.links?.[1]?.text || ""} />
            </Link>
          </motion.div>
        </motion.div>
      </InfoBlock>
      <AnimatedWrapper as="div" animation={listVariants({ staggerChildren: 0.5, delayChildren: 0.4 })} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 lg:hidden">
        {mobileImages.map((image, index) => (
          <AnimatedWrapper as="div" key={image.src} viewport={{ once: true }} className={`relative w-full aspect-328/268 rounded-[16px] overflow-hidden ${index === 0 ? "md:row-span-2 md:h-full" : "md:row-span-1"}`}>
            <Image src={image.src} alt={image.alt} fill quality={75} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center rounded-[16px]" />
          </AnimatedWrapper>
        ))}
      </AnimatedWrapper>
    </div>
  );
};

export default AboutUs;

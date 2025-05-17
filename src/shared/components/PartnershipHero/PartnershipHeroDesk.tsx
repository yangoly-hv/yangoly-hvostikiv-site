import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import ContactFormAction from "../ContactFormAction/ContactFormAction";
import Image from "next/image";
import {
  containerVariants,
  listItemVariants,
  listItemVariantSecond,
} from "../Animations/animationVariants";

const PartnershipHeroDesk = async () => {
  const t = await getTranslations("Partnership");

  return (
    <div className="container hidden lg:block px-[40px] mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="bg-white pl-[25px] relative flex rounded-[8px]"
      >
        <div>
          <Image
            src="/images/partners/paw-desk-1.png"
            alt="Paws"
            width={150}
            height={150}
            className="absolute left-0 top-0 z-[1]"
          />
          <Image
            src="/images/partners/paw-desk-2.png"
            alt="Paws"
            width={185}
            height={185}
            className="absolute left-[496px] top-0 z-[1]"
          />
          <Image
            src="/images/partners/paw-desk-3.png"
            alt="Paws"
            width={98}
            height={98}
            className="absolute left-0 top-[270px] z-[1]"
          />
          <Image
            src="/images/partners/paw-desk-4.png"
            alt="Paws"
            width={104}
            height={104}
            className="absolute left-[346px] bottom-0 z-[1]"
          />
        </div>
        <motion.div
          variants={containerVariants}
          className="flex flex-col justify-center my-[80px] xl:my-[135px] max-w-[420px] xl:max-w-[508px] z-[10]"
        >
          <motion.h2
            variants={listItemVariants}
            className="text-[32px] leading-[130%] uppercase font-arial"
          >
            {t("heroTitle")}
          </motion.h2>

          <motion.p
            variants={listItemVariants}
            className="text-[18px] mt-6 leading-[130%]"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div className="z-100" variants={listItemVariants}>
            <ContactFormAction
              buttonText={t("heroButton")}
              variant="primary"
              className="w-[400px] xl:w-[451px] h-[67px] mt-[120px] lg:text-[18px]"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={listItemVariantSecond}
          className="relative z-[2] "
        >
          <Image
            src="/images/partners/ellipse-desk.png"
            alt="Ellipse"
            width={1535}
            height={1128}
            className="h-full max-h-[608px] rounded-r-[8px]"
          />
          <Image
            src="/images/partners/dogs-desk.webp"
            alt="Dogs"
            width={1011}
            height={783}
            className="aspect-ratio-[1011/783] absolute bottom-[-75px] tabxl:bottom-[-85px]  right-[0px] xl:bottom-[-107px] laptop:bottom-[-125px] 2xl:bottom-[-130px] desk:bottom-[-142px] z-[1]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PartnershipHeroDesk;

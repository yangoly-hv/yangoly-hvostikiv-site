import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import ContactFormAction from "@/widgets/ContactFormAction/ContactFormAction";
import SafeImage from "@/shared/components/SafeImage/SafeImage";
import { HeartIcon } from "../Icons/HeartIcon";
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
          <SafeImage
            src="/images/partners/paw-desk-1.png"
            alt="Paws"
            width={150}
            height={150}
            className="absolute left-0 top-0 z-1"
          />
          <SafeImage
            src="/images/partners/paw-desk-2.png"
            alt="Paws"
            width={185}
            height={185}
            className="absolute left-[496px] top-0 z-1"
          />
          <SafeImage
            src="/images/partners/paw-desk-3.png"
            alt="Paws"
            width={98}
            height={98}
            className="absolute left-0 top-[270px] z-1"
          />
          <SafeImage
            src="/images/partners/paw-desk-4.png"
            alt="Paws"
            width={104}
            height={104}
            className="absolute left-[346px] bottom-0 z-1"
          />
        </div>
        <motion.div
          variants={containerVariants}
          className="flex flex-col justify-center my-[80px] xl:my-[135px] max-w-[420px] xl:max-w-[508px] z-10"
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
              source="partnership"
              variant="primary"
              className="w-[400px] xl:w-[451px] h-[67px] mt-[120px] lg:text-[18px]"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={listItemVariantSecond}
          className="relative z-2 "
        >
          <SafeImage
            src="/images/partners/ellipse-desk.png"
            alt="Ellipse"
            width={1535}
            height={1128}
            className="block h-full max-h-[608px] rounded-r-[8px]"
          />
          <SafeImage
            src="/images/partners/hero-desk.webp"
            alt="Dogs"
            width={749}
            height={783}
            priority
            sizes="100vw"
            className="block z-10 aspect-ratio-[749/783] absolute bottom-[-100px] tabxl:bottom-[-114px]  right-[60px] xl:bottom-[-141px] laptop:bottom-[-125px] 2xl:bottom-[-142px] desk:bottom-[-142px]"
          />
          <HeartIcon
            width={639}
            height={494}
            className="absolute lg:w-[419px] lg:h-[347px] xl:w-[519px] xl:h-[417px] 2xl:w-[639px] 2xl:h-[494px] right-[25px] bottom-[-55px] z-1"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PartnershipHeroDesk;

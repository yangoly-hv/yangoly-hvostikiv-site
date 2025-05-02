import { getLocale, getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import Image from "next/image";
import ContactFormAction from "../ContactFormAction/ContactFormAction";
import { Locale } from "@/shared/types";

const PartnershipHeroMob = async () => {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Partnership");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="bg-white lg:hidden pb-6 relative overflow-hidden"
    >
      <div>
        <Image
          src="/images/partners/paw-mob1.png"
          width={29}
          height={29}
          alt="Paw"
          className="absolute left-[20px]"
        />
        <Image
          src="/images/partners/paw-mob-2.png"
          width={29}
          height={29}
          alt="Paw"
          className="absolute right-0"
        />
        <Image
          src="/images/partners/paw-mob-3.png"
          width={29}
          height={29}
          alt="Paw"
          className="absolute top-[135px] right-0"
        />
        <Image
          src="/images/partners/paw-mob-4.png"
          width={29}
          height={29}
          alt="Paw"
          className="absolute bottom-0 right-0"
        />
        <Image
          src="/images/partners/paw-mob-5.png"
          width={29}
          height={29}
          alt="Paw"
          className="absolute bottom-[64px] left-0"
        />
        <Image
          src="/images/partners/paw-mob-6.png"
          width={29}
          height={29}
          alt="Paw"
          className="absolute top-[114px] left-0"
        />
      </div>

      <div className="px-[30px] pt-[16px] flex max-w-[301px] mx-auto flex-col items-center justify-center gap-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
          className="font-arial text-center text-[18px] uppercase leading-[130%] text-black"
        >
          {t("heroTitle")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center text-[12px] leading-[130%]"
        >
          {t("heroSubtitle")}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative w-full min-h-[135px] mt-[37px]"
      >
        <Image src="/images/partners/ellipse.png" alt="Ellipse" fill />
        <Image
          className="absolute bottom-[-55px] w-[408px] h-[276px] left-1/2 -translate-x-1/2"
          src="/images/partners/dogs-mob.webp"
          alt="Dogs"
          width={408}
          height={276}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex justify-center items-center"
      >
        <ContactFormAction
          lang={locale}
          buttonText={t("heroButton")}
          variant="primary"
          className="max-w-[328px] mt-[37px]"
        />
      </motion.div>
    </motion.div>
  );
};

export default PartnershipHeroMob;

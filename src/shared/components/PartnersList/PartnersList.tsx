import * as motion from "motion/react-client";
import { IPartnerItem } from "@/shared/types";
import { getTranslations } from "next-intl/server";
import PartnersListItem from "./PartnersListItem";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";
import Image from "next/image";

const PartnersList = async () => {
  const t = await getTranslations("PartnersList");
  const list = (await t.raw("list")) as IPartnerItem[];

  return (
    <section className="relative pb-[100px] lg:pb-[165px] ">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="px-4 container mx-auto xl:px-[40px] uppercase text-center font-arial leading-[130%] text-[24px] xl:text-[44px] mb-[40px] xl:mb-[64px]"
      >
        {t("title")}
      </motion.h2>
      <Image
        src="/images/partners/paw-list-1.png"
        alt="Paws"
        width={287}
        height={287}
        className="absolute hidden lg:block left-0 bottom-[410px] z-[1] pointer-events-none"
      />
      <Image
        src="/images/partners/paw-list-2.png"
        alt="Paws"
        width={268}
        height={268}
        className="absolute hidden lg:block right-0 bottom-[425px] z-[1] pointer-events-none"
      />
      <Image
        src="/images/partners/paw-list-3.png"
        alt="Paws"
        width={187}
        height={187}
        className="absolute hidden lg:block right-0 bottom-[30px] z-[1] pointer-events-none"
      />
      <Image
        src="/images/partners/paw-list-4.png"
        alt="Paws"
        width={256}
        height={256}
        className="absolute hidden lg:block left-0 bottom-0 z-[1] pointer-events-none"
      />

      <div className="container  px-4 xl:px-[40px] mx-auto overflow-hidden">
        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 relative z-[2]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {list.map((partner, index) => {
            const isLastOdd =
              index === list.length - 1 && list.length % 2 !== 0;

            return (
              <motion.div
                key={index}
                variants={listItemVariants}
                className={isLastOdd ? "md:col-span-2 md:w-1/2 md:mx-auto" : ""}
              >
                <PartnersListItem partner={partner} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersList;

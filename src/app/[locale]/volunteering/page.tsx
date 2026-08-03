import { getTranslations, setRequestLocale } from "next-intl/server";
import * as motion from "motion/react-client";
import Contacts from "@/modules/Contacts/Contacts";
import HelpSection from "@/shared/components/HelpSection/HelpSection";
import WhatVolunteerGet from "@/shared/components/WhatVolunteerGet/WhatVolunteerGet";
import { PageParams } from "@/shared/types";
import { Metadata } from "next";
import { getPageMetadata } from "@/shared/lib/metadata";
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({ locale, key: "volunteering", path: "/volunteering" });
}

export default async function VolunteeringPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "VolunteeringPage" });

  return (
    <>
      <div className="container px-4 xl:px-[40px] mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mt-[60px] mb-[40px] font-arial text-[24px] lg:text-[44px] leading-[130%] uppercase"
        >
          {t("title")}
        </motion.h1>
      </div>

      <div className="container px-4 xl:px-[40px] mx-auto">
        <HelpSection />
      </div>
      <WhatVolunteerGet />
      <Contacts />
    </>
  );
}

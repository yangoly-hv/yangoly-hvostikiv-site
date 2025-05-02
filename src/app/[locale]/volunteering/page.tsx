import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import Contacts from "@/modules/Contacts/Contacts";
import HelpSection from "@/shared/components/HelpSection/HelpSection";
import WhatVolunteerGet from "@/shared/components/WhatVolunteerGet/WhatVolunteerGet";

export default async function VolunteeringPage() {
  const t = await getTranslations("VolunteeringPage");

  return (
    <section>
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
    </section>
  );
}

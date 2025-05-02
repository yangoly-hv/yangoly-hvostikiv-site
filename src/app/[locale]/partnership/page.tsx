import * as motion from "motion/react-client";

import PartnershipHero from "@/shared/components/PartnershipHero/PartnershipHero";
import PartnersList from "@/shared/components/PartnersList/PartnersList";
import PartnersSupport from "@/shared/components/PartnersSupport/PartnersSupport";
import Image from "next/image";

export default async function ParnershipPage() {
  return (
    <>
      <PartnershipHero />
      <PartnersList />
      <PartnersSupport />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="relative  aspect-[360/155] mt-[50px]"
      >
        <Image src="/images/partners/support/bg.png" alt="bg" fill />
        <Image
          src="/images/partners/support/dogs.png"
          alt="bg"
          fill
          className="xl:px-[160px]"
        />
      </motion.div>
    </>
  );
}

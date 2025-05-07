import * as motion from "motion/react-client";

import PartnershipHero from "@/shared/components/PartnershipHero/PartnershipHero";
import PartnersList from "@/shared/components/PartnersList/PartnersList";
import PartnersSupport from "@/shared/components/PartnersSupport/PartnersSupport";
import Image from "next/image";
import Contacts from "@/modules/Contacts/Contacts";
import { Metadata } from "next";
import { IMetadata, PageParams } from "@/shared/types";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Loading from "@/app/loading";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const metadata = (await t.raw("partnership")) as IMetadata;
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${baseUrl}/${locale}/blog`,
      type: "website",
      locale: locale,
      images: [
        {
          url: "/images/about/about-us-desk3.jpg",
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
  };
}
export default async function ParnershipPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
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
        <Contacts />
      </Suspense>
    </>
  );
}

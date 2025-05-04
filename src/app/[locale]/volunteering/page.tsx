import { getTranslations } from "next-intl/server";
import * as motion from "motion/react-client";
import Contacts from "@/modules/Contacts/Contacts";
import HelpSection from "@/shared/components/HelpSection/HelpSection";
import WhatVolunteerGet from "@/shared/components/WhatVolunteerGet/WhatVolunteerGet";
import { IMetadata, PageParams } from "@/shared/types";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const metadata = (await t.raw("volunteering")) as IMetadata;
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

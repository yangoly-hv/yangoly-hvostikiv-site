import Hero from "../../../shared/components/ChairtyBlocks/Hero";
import Paragraphs from "../../../shared/components/ChairtyBlocks/Paragraphs";
import Benefits from "../../../shared/components/ChairtyBlocks/Benefits";
import Mission from "../../../shared/components/ChairtyBlocks/Mission";
import Contacts from "@/modules/Contacts/Contacts";
import { getTranslations, setRequestLocale } from "next-intl/server";
import WhatWeHaveInEvents from "@/shared/components/WhatWeHaveInEvents/WhatWeHaveInEvents";
import EventsDonateSection from "@/shared/components/ChairtyBlocks/EventsDonateSection";
import HelpAnimalsSection from "@/shared/components/HelpAnimalsSection/HelpAnimalsSection";
import { PageParams } from "@/shared/types";
import { Metadata } from "next";
import { getCharityEvents } from "@/features/events/server/data";
import { getPageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({
    locale,
    key: "charityEvents",
    path: "/charity-events",
  });
}

export default async function CharityEventPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, content] = await Promise.all([
    getTranslations({ locale, namespace: "CharityEvents" }),
    getCharityEvents(),
  ]);
  const paragraphs = t.raw("paragraphs");
  const images = content?.images || [];
  const pageTitle = content?.title?.[locale] || t("title");

  return (
    <section className="bg-orange-bg">
        <Hero images={images} title={t("title")} />
        <Paragraphs
          title={t("title")}
          mobTitle={pageTitle}
          deskTitle={pageTitle}
          paragraphs={paragraphs}
        />
        <Mission
          missionTitle={t("missionTitle")}
          missionParagraph={t("missionText")}
        />
        <WhatWeHaveInEvents />
        <Benefits />
        <EventsDonateSection
          title={t("donate.title")}
          text={t("donate.text")}
          buttonText={t("donate.buttonText")}
        />
        <HelpAnimalsSection />
        <Contacts />
    </section>
  );
}

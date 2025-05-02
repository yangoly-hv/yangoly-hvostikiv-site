import Hero from "../../../shared/components/ChairtyBlocks/Hero";
import Paragraphs from "../../../shared/components/ChairtyBlocks/Paragraphs";
import Benefits from "../../../shared/components/ChairtyBlocks/Benefits";
import Mission from "../../../shared/components/ChairtyBlocks/Mission";
import Contacts from "@/modules/Contacts/Contacts";
import GallerySlider from "../../../shared/components/ChairtyBlocks/GallerySlider";
import { getTranslations } from "next-intl/server";
import WhatWeHaveInEvents from "@/shared/components/WhatWeHaveInEvents/WhatWeHaveInEvents";
import EventsDonateSection from "@/shared/components/ChairtyBlocks/EventsDonateSection";

const slides = [
  "/images/chairty5.jpg",
  "/images/partners1.jpg",
  "/images/partners2.jpg",
  "/images/partners3.jpg",
  "/images/partners4.jpg",
  "/images/partners1.jpg",
  "/images/partners2.jpg",
  "/images/partners3.jpg",
  "/images/partners4.jpg",
  "/images/partners1.jpg",
  "/images/partners2.jpg",
  "/images/partners3.jpg",
  "/images/partners4.jpg",
];

export default async function CharityEventPage() {
  const t = await getTranslations("ChairtyEvents");
  const paragraphs = await t.raw("paragraphs");

  return (
    <section className="bg-orange-bg">
      {/* Гіро секція */}
      <Hero title={t("title")} />
      {/* 4 абзаци */}
      <Paragraphs
        mobTitle={t("missionTitleMob")}
        deskTitle={t("missionTitleDesk")}
        paragraphs={paragraphs}
      />
      {/* Місія заходів */}
      <Mission
        missionTitle={t("missionTitle")}
        missionParagraph={t("missionText")}
      />
      <WhatWeHaveInEvents />
      {/* Переваги заходів */}
      <Benefits />
      <EventsDonateSection />
      <GallerySlider slides={slides} />
      <Contacts />
    </section>
  );
}

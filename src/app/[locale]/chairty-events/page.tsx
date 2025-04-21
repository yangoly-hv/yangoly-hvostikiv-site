import { PageParams } from "@/shared/types";
import { getDictionary } from "@/shared/utils";
import Hero from "../../../shared/components/ChairtyBlocks/Hero";
import Paragraphs from "../../../shared/components/ChairtyBlocks/Paragraphs";
import Benefits from "../../../shared/components/ChairtyBlocks/Benefits";
import Mission from "../../../shared/components/ChairtyBlocks/Mission";
import ButtonsSection from "../../../shared/components/ChairtyBlocks/ButtonsSection";
import Contacts from "@/modules/Contacts/Contacts";
import GallerySlider from "../../../shared/components/ChairtyBlocks/GallerySlider";

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

export default async function CharityEventPage({ params }: PageParams) {
  const { locale } = await params;

  const { chairtyEvents: t, contacts } = await getDictionary(locale);

  return (
    <section className="bg-orange-bg">
      {/* Гіро секція */}
      <Hero title={t.title} />
      {/* 4 абзаци */}
      <Paragraphs paragraphs={t.paragraphs} />
      {/* Переваги заходів */}
      <Benefits
        benefitsTitle={t.benefitsTitle}
        benefitsParagraphs={t.benefitsParagraphs}
      />
      {/* Місія заходів */}
      <Mission
        missionTitle={t.missionTitle}
        missionParagraph={t.missionParagraph}
      />
      {/* Секція з кнопками */}
      <ButtonsSection
        buttons={t.buttons}
        botParagraphs={t.botParagraphs}
        lang={locale}
        contactFormTitle={t.partnerModalTitle}
      />
      <GallerySlider slides={slides} />
      <Contacts lang={locale} translation={contacts} />
    </section>
  );
}

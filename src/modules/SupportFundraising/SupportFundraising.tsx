import { Locale } from "@/shared/types";
import FundraisingSlider from "../../shared/components/Sliders/FundraisingSlider";
const translations = {
  uk: {
    title: "Підтримати благодійні збори",
    cardTitles: ["Актуальний збір", "Разова допомога", "Стерилізація"],
    goal: "Ціль",
    currency: "грн",
    buttonText: "Підтримати",
    image: "/images/card-image.jpg",
  },
  en: {
    title: "Support Charity Fundraising",
    cardTitles: ["Current Fundraising", "One-Time Help", "Sterilization"],
    goal: "Goal",
    currency: "UAH",
    buttonText: "Support",
    image: "/images/card-image.jpg",
  },
};

const SupportFundraising = ({ lang }: { lang: Locale }) => {
  const t = translations[lang] || translations.uk;

  return (
    <section className="container mx-auto px-4 xl:px-10 bg-orange-bg">
      <h2 className="text-black text-[24px] font-extrabold uppercase xl:text-[32px] leading-[130%] text-center mb-8">
        {t.title}
      </h2>

      <FundraisingSlider lang={lang} t={t} />
    </section>
  );
};

export default SupportFundraising;

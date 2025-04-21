import About from "@/modules/About/About";
import Angels from "@/modules/Angels/Angels";
import ChangeLife from "@/modules/ChangeLife/ChangeLife";
import Contacts from "@/modules/Contacts/Contacts";
import Hero from "@/modules/Hero/Hero";
import MonthlyGoalSection from "@/modules/MonthlyGoalSection/MonthlyGoalSection";
import Partners from "@/modules/Partners/Partners";
import SupportFundraising from "@/modules/SupportFundraising/SupportFundraising";
import WorkResults from "@/modules/WorkResults/WorkResults";
import { PageParams } from "@/shared/types";
import { getDictionary } from "@/shared/utils";

export default async function Home({ params }: PageParams) {
  const { locale } = await params;
  const {
    hero,
    changeLife,
    angels,
    about,
    monthlyGoalSection,
    workResults,
    partners,
    contacts,
    donateModal,
  } = await getDictionary(locale);

  return (
    <>
      <Hero lang={locale} translation={hero} />
      <WorkResults translation={workResults} />
      <ChangeLife translation={changeLife} />
      <Angels
        translation={angels}
        lang={locale}
        donateModalTranslataion={donateModal}
      />
      <About translation={about} />
      <MonthlyGoalSection
        translation={monthlyGoalSection}
        donateModalTranslataion={donateModal}
        lang={locale}
      />
      <SupportFundraising lang={locale} />
      <div className="container mx-auto px-4 pt-[160px] pb-[80px] xl:py-[120px] xl:px-10">
        <Partners translation={partners} />
      </div>
      <Contacts translation={contacts} lang={locale} />
    </>
  );
}

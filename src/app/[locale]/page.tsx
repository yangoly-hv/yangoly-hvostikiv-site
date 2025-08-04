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

export default async function Home({ params }: PageParams) {
  const { locale } = await params;

  return (
    <>
      <Hero />
      <WorkResults />
        <MonthlyGoalSection lang={locale} />
      <ChangeLife />
      <Angels />
        <SupportFundraising lang={locale} />
      <About />
      <div className="container mx-auto px-4 pt-[160px] pb-[80px] xl:py-[120px] xl:px-10">
        <Partners />
      </div>
      <Contacts />
    </>
  );
}

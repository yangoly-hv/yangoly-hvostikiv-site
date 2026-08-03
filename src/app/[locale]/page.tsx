import About from "@/modules/About/About";
import ActivityDirections from "@/modules/ActivityDirections/ActivityDirections";
import ProblemsWeSolve from "@/modules/ProblemsWeSolve/ProblemsWeSolve";
import WhatChangesThanksToUs from "@/modules/WhatChangesThanksToUs/WhatChangesThanksToUs";
import WhatMakesUsDifferent from "@/modules/WhatMakesUsDifferent/WhatMakesUsDifferent";
import Angels from "@/modules/Angels/Angels";
import ChangeLife from "@/modules/ChangeLife/ChangeLife";
import Contacts from "@/modules/Contacts/Contacts";
import Hero from "@/modules/Hero/Hero";
import MonthlyGoalSection from "@/modules/MonthlyGoalSection/MonthlyGoalSection";
import Partners from "@/modules/Partners/Partners";
import WorkResults from "@/modules/WorkResults/WorkResults";
import { PageParams } from "@/shared/types";
import { setRequestLocale } from "next-intl/server";

export default async function Home({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <WorkResults />
      <MonthlyGoalSection lang={locale} />
      <Angels />

      <ChangeLife />

      <About lang={locale} />
      <ActivityDirections />
      <ProblemsWeSolve />
      <WhatMakesUsDifferent />
      <WhatChangesThanksToUs />
      <div className="container mx-auto px-4 pb-[80px] xl:pb-[120px] xl:px-10">
        <Partners />
      </div>
      <Contacts />
    </>
  );
}

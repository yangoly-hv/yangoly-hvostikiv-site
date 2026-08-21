import About from "@/modules/About/About";
import ActivityDirections from "@/modules/ActivityDirections/ActivityDirections";
import ProblemsWeSolve from "@/modules/ProblemsWeSolve/ProblemsWeSolve";
import WhatChangesThanksToUs from "@/modules/WhatChangesThanksToUs/WhatChangesThanksToUs";
import WhatMakesUsDifferent from "@/modules/WhatMakesUsDifferent/WhatMakesUsDifferent";
import Angels from "@/modules/Angels/Angels";
import Volunteers from "@/modules/Volunteers/Volunteers";
import ChangeLife from "@/modules/ChangeLife/ChangeLife";
import Contacts from "@/modules/Contacts/Contacts";
import Hero from "@/modules/Hero/Hero";
import MonthlyGoalSection from "@/modules/MonthlyGoalSection/MonthlyGoalSection";
import WorkResults from "@/modules/WorkResults/WorkResults";
import { PageParams } from "@/shared/types";
import { setRequestLocale } from "next-intl/server";
import JsonLd from "@/shared/components/JsonLd";
import { getWebSiteSchema } from "@/shared/lib/structuredData";

export default async function Home({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={getWebSiteSchema(locale)} />
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
      <Volunteers />
      <Contacts />
    </>
  );
}

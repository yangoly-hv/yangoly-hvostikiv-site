import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import EventRegistrationView from "@/features/event-registration/ui/EventRegistrationView";
import { getEventRegistrationCopy } from "@/features/event-registration/model/copy";
import type { AppLocale } from "@/shared/config/site";
import { isAppLocale } from "@/shared/config/site";
import { getPageMetadata } from "@/shared/lib/metadata";
import type { PageParams } from "@/shared/types";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const base = await getPageMetadata({
    locale,
    key: "eventRegistration",
    path: "/event-registration",
  });

  return {
    ...base,
    robots: { index: false, follow: false },
  };
}

export default async function EventRegistrationPage({ params }: PageParams) {
  const { locale: rawLocale } = await params;
  const locale: AppLocale = isAppLocale(rawLocale) ? rawLocale : "uk";
  setRequestLocale(locale);
  const copy = getEventRegistrationCopy(locale);

  return (
    <section className="bg-orange-bg">
      <div className="container mx-auto px-4 pb-10 pt-8 md:pb-12 md:pt-10 xl:px-10">
        <h1 className="mb-2 text-center font-arial text-[22px] font-black uppercase leading-[120%] text-dark md:mb-3 md:text-[32px] lg:text-[40px]">
          {copy.title}
        </h1>
        <p className="mx-auto mb-5 max-w-xl text-center text-[15px] leading-[135%] text-dark md:mb-6 md:text-[16px]">
          {copy.intro}
        </p>
        <EventRegistrationView locale={locale} />
      </div>
    </section>
  );
}

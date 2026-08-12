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
      <div className="container mx-auto px-4 pb-16 pt-[60px] xl:px-10">
        <h1 className="mb-4 text-center font-arial text-[24px] font-black uppercase leading-[130%] text-dark lg:text-[44px]">
          {copy.title}
        </h1>
        <p className="mx-auto mb-10 max-w-[640px] text-center text-[16px] leading-[140%] text-dark lg:text-[18px]">
          {copy.intro}
        </p>
        <EventRegistrationView locale={locale} />
      </div>
    </section>
  );
}

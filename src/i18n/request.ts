import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  if (!requested) {
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../../public/messages/${routing.defaultLocale}.json`))
        .default,
    };
  }

  if (!hasLocale(routing.locales, requested)) {
    notFound();
  }

  return {
    locale: requested,
    messages: (await import(`../../public/messages/${requested}.json`)).default,
  };
});

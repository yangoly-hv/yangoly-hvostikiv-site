import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/shared/config/site";

export const routing = defineRouting({
  locales,
  defaultLocale,
});

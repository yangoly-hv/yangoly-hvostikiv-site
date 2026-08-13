"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { ILanguage, ILanguages, Locale } from "@/shared/types";
import { cn } from "@/shared/utils";
import {
  ArrowDonwIcon,
  BritishFlag,
  UkraineFlag,
} from "../../../../public/images/icons";

const languages: ILanguages = {
  uk: { name: "UA", icon: <UkraineFlag /> },
  en: { name: "EN", icon: <BritishFlag /> },
};

const queryFromLocation = () =>
  Object.fromEntries(new URLSearchParams(window.location.search));

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const selectedLocale = useLocale() as Locale;
  const selectedLanguage = languages[selectedLocale];
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleSwitch = (newLocale: Locale) => {
    if (newLocale === selectedLocale || isPending) {
      setIsOpen(false);
      return;
    }

    const query = queryFromLocation();
    startTransition(() => {
      router.replace(
        Object.keys(query).length > 0 ? { pathname, query } : pathname,
        { locale: newLocale }
      );
      router.refresh();
    });
    setIsOpen(false);
  };

  if (!selectedLanguage) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        disabled={isPending}
        onClick={() => setIsOpen((value) => !value)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 disabled:opacity-60"
      >
        <div className="shrink-0">{selectedLanguage.icon}</div>
        <span className="text-sm font-medium text-[#262827]">{selectedLanguage.name}</span>
        <ArrowDonwIcon className={cn("w-4 h-4 transition-transform text-[#262827]", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-100" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {(Object.entries(languages) as [Locale, ILanguage][]).map(
              ([langCode, { name, icon }]) => (
                <button
                  type="button"
                  key={langCode}
                  disabled={isPending}
                  onClick={() => handleLocaleSwitch(langCode)}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-2 text-sm text-[#262827] hover:bg-gray-50 disabled:opacity-60",
                    selectedLocale === langCode && "bg-gray-100"
                  )}
                >
                  <div className="shrink-0">{icon}</div>
                  <span className="font-medium">{name}</span>
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;

"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
  ArrowDonwIcon,
  BritishFlag,
  UkraineFlag,
} from "../../../../public/images/icons";
import { ILanguage, ILanguages, Locale } from "@/shared/types";
import { cn } from "@/shared/utils";
import { motion, AnimatePresence } from "framer-motion";

const languages: ILanguages = {
  uk: {
    name: "UA",
    icon: <UkraineFlag />,
  },
  en: {
    name: "EN",
    icon: <BritishFlag />,
  },
};

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const defaultLocale = useLocale() as Locale;
  const [selectedLocale, setSelectedLocale] = useState<Locale>(defaultLocale);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedLocale(defaultLocale);
  }, [defaultLocale]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/");

    // Перевіряємо, чи є перша частина шляху локаллю
    if (pathParts.length > 1) {
      const possibleLocale = pathParts[1] as Locale;
      if (Object.keys(languages).includes(possibleLocale)) {
        setSelectedLocale(possibleLocale);
      }
    }
  }, [pathname]);

  const pathnameWithoutLocale = () => {
    const pathParts = pathname.split("/");
    if (pathParts.length > 1 && Object.keys(languages).includes(pathParts[1])) {
      return "/" + pathParts.slice(2).join("/");
    }
    return pathname;
  };

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
    // Встановлюємо локальний стан відразу
    setSelectedLocale(newLocale);

    const cleanPathname = pathnameWithoutLocale();

    window.location.href = `/${newLocale}${cleanPathname || "/"}`;

    setIsOpen(false);
  };
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50"
      >
        <div className="flex-shrink-0">{languages[selectedLocale]?.icon}</div>
        <span className="text-sm font-medium text-[#262827]">
          {languages[selectedLocale]?.name}
        </span>
        <ArrowDonwIcon
          className={cn(
            "w-4 h-4 transition-transform text-[#262827]",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-100"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {(Object.entries(languages) as [Locale, ILanguage][]).map(
              ([langCode, { name, icon }]) => (
                <button
                  key={langCode}
                  onClick={() => handleLocaleSwitch(langCode)}
                  className={cn(
                    "w-full flex items-center gap-2 px-4 py-2 text-sm text-[#262827] hover:bg-gray-50",
                    selectedLocale === langCode && "bg-gray-100"
                  )}
                >
                  <div className="flex-shrink-0">{icon}</div>
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

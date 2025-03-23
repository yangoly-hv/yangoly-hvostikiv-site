"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowDonwIcon,
  BritishFlag,
  UkraineFlag,
} from "../../../../public/images/icons";
import { ILanguage, ILanguages, Locale } from "@/shared/types";
import { cn } from "@/shared/utils";
import { motion, AnimatePresence } from "framer-motion";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const getCurrentLocale = (): Locale => {
    const pathSegments = pathname?.split("/");
    return (pathSegments?.[1] as Locale) || "uk";
  };

  const [currentLocale, setCurrentLocale] = useState<Locale>(getCurrentLocale);

  useEffect(() => {
    setCurrentLocale(getCurrentLocale());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  const switchLanguage = (newLocale: Locale) => {
    const currentLocale = getCurrentLocale();
    const currentPath = pathname.replace(`/${currentLocale}`, "");

    const searchParams = new URLSearchParams(window.location.search);
    const newUrl = `/${newLocale}${currentPath}?${searchParams.toString()}`;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
    router.push(newUrl);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50"
      >
        <div className="flex-shrink-0 items-center">
          {languages[currentLocale]?.icon}
        </div>
        <span className="text-sm font-medium text-[#262827]">
          {languages[currentLocale]?.name}
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
              ([locale, { name, icon }]) => (
                <button
                  key={locale}
                  onClick={() => switchLanguage(locale)}
                  className={`w-full flex items-center text-[#262827] gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${
                    currentLocale === locale ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex-shrink-0 items-center">{icon}</div>
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

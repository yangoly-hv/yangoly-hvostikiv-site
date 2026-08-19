"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { BurgerButtonIcon } from "../../../public/images/icons";
import LanguageSwitcher from "@/shared/components/LanguageSwitcher/LanguageSwitcher";
import Logo from "@/shared/components/Logo/Logo";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import BurgerMenu from "@/shared/components/BurgerMenu/BurgerMenu";
import DonateAction from "@/shared/components/DonateAction/DonateAction";
import type { SocialLink } from "@/shared/lib/socialLinks";

type HeaderProps = {
  socials?: SocialLink[];
};

const Header = ({ socials = [] }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Header");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollPosition(latest);
  });

  const glass = scrollPosition > 20;
  // Over the home hero photos the header is fully transparent, so flip to white.
  const light = isHome && !glass;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 py-2 lg:py-3">
      <div className="relative z-10 mx-1 flex max-w-7xl items-center justify-between rounded-full px-3 py-2 sm:mx-2 sm:px-4 lg:mx-8 xl:mx-auto xl:w-[calc(100%-64px)] xl:px-6">
        <div
          className={`absolute inset-0 -z-10 rounded-full bg-[linear-gradient(90.95deg,rgba(231,231,231,0.8)_52.25%,rgba(255,255,255,0.8)_99.18%)] shadow-[inset_0px_4px_12.6px_0px_rgba(255,255,255,0.25)] backdrop-blur-[10px] transition-opacity duration-500 ease-out ${
            glass ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-0 -z-10 rounded-full transition-opacity duration-500 ease-out ${
            glass ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(270.67deg, #F2F2F2 -9.58%, #C7C7C7 103.45%)",
            padding: "1px",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          aria-hidden
        />
        <Logo
          href="/"
          variant={light ? "black" : "color"}
          className="w-[94px] h-10 2xl:w-[112px] 2xl:h-12"
          alt={t("logoAlt")}
        />
        <div className="flex justify-center items-center gap-4 xl:gap-8 laptop:gap-8">
          <LanguageSwitcher light={light} />
          <DonateAction
            variant="outline"
            className={
              light
                ? "hidden xl:block w-auto whitespace-nowrap xl:text-[16px] bg-transparent text-white border-white hover:text-dark hover:bg-white"
                : "hidden xl:block w-auto whitespace-nowrap xl:text-[16px] bg-inherit text-dark border-dark hover:text-white hover:bg-dark"
            }
            color="text-dark bg-orange"
            buttonText={t("donateButton")}
          />
          <button
            type="button"
            className={`ml-auto transition-colors duration-300 ${
              light ? "text-white" : "text-dark"
            }`}
            aria-label={t("openMenu")}
            onClick={() => setIsMenuOpen(true)}
          >
            <BurgerButtonIcon />
          </button>
        </div>
      </div>
      <BurgerMenu
        onClose={() => setIsMenuOpen(false)}
        isOpen={isMenuOpen}
        socials={socials}
      />
    </header>
  );
};

export default Header;

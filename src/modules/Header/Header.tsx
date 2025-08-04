"use client";

import { useState } from "react";
import { BurgerButtonIcon } from "../../../public/images/icons";
import LanguageSwitcher from "@/shared/components/LanguageSwitcher/LanguageSwitcher";
import Logo from "@/shared/components/Logo/Logo";
import { useTranslations } from "next-intl";
import BurgerMenu from "@/shared/components/BurgerMenu/BurgerMenu";
import DonateAction from "@/shared/components/DonateAction/DonateAction";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 flex-col bg-white border-b border-[#E9E9EE] xl:bg-background-gray  w-full flex justify-between items-center z-50">
      <div className="flex w-full justify-between px-4 py-3 xl:py-[18px] xl:px-10  ">
        <Logo
          href="/"
          variant="color"
          className="w-[94px] h-10 2xl:w-[112px] 2xl:h-12"
        />
        <div className="flex justify-center items-center gap-4 xl:gap-8 laptop:gap-8">
          <LanguageSwitcher />
          <DonateAction
            variant="outline"
            className="hidden xl:block bg-inherit text-dark border-dark hover:text-white hover:bg-dark"
            color="text-dark bg-orange"
            buttonText={t("donateButton")}
          />

          <button className={"ml-[auto]"} onClick={() => setIsMenuOpen(true)}>
            <BurgerButtonIcon />
          </button>
        </div>
      </div>
      <BurgerMenu onClose={() => setIsMenuOpen(false)} isOpen={isMenuOpen} />
    </header>
  );
};

export default Header;

"use client";
import { useCallback, useState } from "react";
import { CloseIcon, BurgerButtonIcon } from "../../../public/images/icons";
import LanguageSwitcher from "@/shared/components/LanguageSwitcher/LanguageSwitcher";
import { IHeaderProps } from "@/shared/types";
import Button from "@/shared/components/Button/Button";
import TopBanner from "../TopBanner/TopBanner";
import BurgerMenu from "@/shared/components/BurgerMenu/BurgerMenu";
import Navbar from "../Navbar/Navbar";
import Logo from "@/shared/components/Logo/Logo";
import DonateModal from "@/shared/components/DonateModal/DonateModal";

const Header = ({
  translation,
  donateModalTranslataion,
  lang,
}: IHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsDonateModalOpen(false);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  return (
    <header className="sticky top-0 flex-col bg-white border-b border-[#E9E9EE] xl:bg-background-gray  w-full flex justify-between items-center z-50">
      <TopBanner />
      <div className="flex w-full justify-between px-4 py-3 xl:py-[18px] xl:px-10  ">
        <Logo
            href="/"
            variant="color"
            className="w-[94px] h-10 2xl:w-[112px] 2xl:h-12"
        />
        <div className="hidden xl:flex">
          <Navbar translation={translation} isOnBurger={false} />
        </div>
        <div className="flex justify-center items-center gap-4 xl:gap-2 laptop:gap-8">
          <LanguageSwitcher />
          <button
            className={`${isMenuOpen ? "ml-[auto]" : "xl:hidden"}`}
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? <CloseIcon /> : <BurgerButtonIcon />}
          </button>
          <Button
            variant="outline"
            className="hidden xl:block bg-inherit text-dark border-dark hover:text-white hover:bg-dark"
            text={translation?.donateButton}
            onClick={() => setIsDonateModalOpen(true)}
          />
        </div>
      </div>
      <BurgerMenu
        onClose={handleCloseMenu}
        lang={lang}
        translation={translation}
        donateModalTranslataion={donateModalTranslataion}
        isOpen={isMenuOpen}
      />
      <DonateModal
        lang={lang}
        translation={donateModalTranslataion}
        isOpen={isDonateModalOpen}
        onClose={handleCloseModal}
      />
    </header>
  );
};

export default Header;

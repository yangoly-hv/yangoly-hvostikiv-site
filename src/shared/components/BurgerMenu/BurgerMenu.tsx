"use client";

import { Link } from "@/i18n/navigation";
import { INavigationItem } from "@/shared/types";
import { useTranslations } from "next-intl";
import DonateAction from "../DonateAction/DonateAction";
import SocialsList from "../SocialsList/SocialsList";
import { CloseIcon } from "../../../../public/images/icons";
import { AnimatePresence, motion, type Variants } from "motion/react";
import type { SocialLink } from "@/shared/lib/socialLinks";

interface IBurgerMenuopProps {
  isOpen: boolean;
  onClose: () => void;
  socials?: SocialLink[];
}

export const menuVariants: Variants = {
  hidden: {
    x: 300,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.4,
    },
  },
  exit: {
    x: 300,
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

const BurgerMenu = ({ isOpen, onClose, socials = [] }: IBurgerMenuopProps) => {
  const t = useTranslations("Header");
  const navigation = t.raw("navigation") as INavigationItem[];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="burger-menu-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={onClose}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="absolute right-0 top-0 w-full sm:w-[70%] lg:w-[40%] bg-white shadow-lg z-50 h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-end pt-5 pr-5 sm:pt-6 sm:pr-6 lg:pr-8">
                <button
                  type="button"
                  aria-label="Закрити меню"
                  onClick={onClose}
                  className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>
              <nav className="px-8 sm:px-12 lg:px-14">
                <ul className="flex flex-col">
                  {navigation.map((item, index) => (
                    <li key={index} className="py-3 sm:py-3.5 lg:py-4 border-b border-[#E1E1E1]">
                      <Link
                        href={item.href}
                        className="cursor-pointer text-gray leading-[120%] hover:text-green-600 transition-colors duration-200 text-[18px] sm:text-[20px]"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto p-4 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5">
                <SocialsList links={socials} iconClass="text-dark" />
                <DonateAction
                  className="bg-inherit text-dark border-dark hover:text-white hover:bg-dark"
                  variant="outline"
                  buttonText={t("donateButton")}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BurgerMenu;

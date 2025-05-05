"use client";

import { Link } from "@/i18n/navigation";
import { INavigationItem } from "@/shared/types";
import { useTranslations } from "next-intl";
import DonateAction from "../DonateAction/DonateAction";
import { CloseIcon } from "../../../../public/images/icons";
import { AnimatePresence, motion } from "framer-motion";

interface IBurgerMenuopProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuVariants = {
  hidden: {
    x: "100%",
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "tween", duration: 0.4 },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { type: "tween", duration: 0.3 },
  },
};

const BurgerMenu = ({ isOpen, onClose }: IBurgerMenuopProps) => {
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
              <div className="flex justify-end pt-8 pr-8">
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>
              <nav className="px-[70px]">
                <ul className="flex flex-col space-y-4">
                  {navigation.map((item, index) => (
                    <li key={index} className="pb-6 border-b border-[#E1E1E1]">
                      <Link
                        href={item.href}
                        className="text-[#27272A] leading-[120%] hover:text-green-600 transition-colors duration-200 text-[24px]"
                        onClick={onClose}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto p-6">
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

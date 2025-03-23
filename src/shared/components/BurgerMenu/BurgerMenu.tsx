"use client";
import { IBurgerMenuProps } from "@/shared/types";
import SocialsList from "@/shared/components/SocialsList/SocialsList";
import Button from "@/shared/components/Button/Button";
import Navbar from "@/modules/Navbar/Navbar";
import DonateModal from "../DonateModal/DonateModal";
import { useState } from "react";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";
import { motion, AnimatePresence } from "framer-motion";

const BurgerMenu = ({
  translation,
  isOpen,
  donateModalTranslataion,
  lang,
  onClose,
}: IBurgerMenuProps) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  useLockBodyScroll(isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-[65px] left-0 right-0 bottom-0 bg-orange-bg z-40 overflow-auto xl:hidden"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="flex flex-col h-full px-4 pt-[32px] pb-8 gap-4 items-start">
            <Navbar
              className="flex flex-col gap-6 items-start"
              translation={translation}
              isOnBurger={true}
              onNavClick={onClose}
            />
            <div className="mt-[32px] w-full">
              <Button
                className="w-full"
                text={translation?.donateButton}
                onClick={() => {
                  setIsDonateModalOpen(true);
                  // onClose();
                }}
              />
              <div className="mt-[22px]">
                <SocialsList iconClass={"text-green"} />
              </div>
            </div>
            <DonateModal
              lang={lang}
              translation={donateModalTranslataion}
              isOpen={isDonateModalOpen}
              onClose={() => setIsDonateModalOpen(false)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BurgerMenu;

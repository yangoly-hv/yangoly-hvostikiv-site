"use client";
import { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { CloseIcon } from "../../../../public/images/icons";
import FundraisingGoal from "@/modules/FundraisingGoal/FundraisingGoal";
import DonateAmountSection from "./DonateAmountSection/DonateAmountSection";
import { IDonateModalProps } from "@/shared/types";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";
import { useTranslations } from "next-intl";

//@ts-expect-error
const KeepingModal = ({ isOpen, price, onClose }: IDonateModalProps) => {
  const t = useTranslations("KeepingModal");
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(isOpen);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {showModal && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]" // Змінено з items-start на items-center
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-[92%] xl:w-[78%] max-h-[90vh] xl:max-h-[90vh] relative bg-white xl:bg-[#FFF7E5] rounded-[12px] xl:rounded-[40px] overflow-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mt-2 xl:mt-10"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky xl:hidden top-0 left-0 right-0 bg-white z-[10000] px-6 py-4 flex justify-end">
              <button
                onClick={onClose}
                className="hover:bg-gray-100 rounded-full"
              >
                <CloseIcon variant="secondary" className="w-6 h-6" />
              </button>
            </div>
            <div className="xl:flex xl:justify-between w-full">
              <FundraisingGoal
                className="xl:hidden"
                imageVariant="small"
                fundraisingTitle={t("fundraisingTitle")}
                goal={t("goal")}
                currency={t("currency")}
                totalAmount={30000}
                currentAmount={10000}
                styles={{
                  titleClassName:
                    "!text-[24px] font-arial font-black uppercase self-stretch text-center max-w-[280px] mx-auto",
                  goalClassName: "text-[14px] text-[#012A0F]",
                  currentAmountClassName:
                    "text-[14px] no-ligatures text-[#012A0F]",
                }}
              />
              <div className="hidden xl:block xl:w-1/2 my-auto">
                <FundraisingGoal
                  imageVariant="big"
                  fundraisingTitle={t("fundraisingTitle")}
                  goal={t("goal")}
                  currency={t("currency")}
                  totalAmount={30000}
                  currentAmount={10000}
                  subtitle={t("subtitle")}
                  styles={{
                    titleClassName:
                      "!text-[36px] font-arial font-black uppercase max-w-[325px] text-center mx-auto",
                    goalClassName: "text-[14px] text-[#012A0F]",
                    currentAmountClassName:
                      "text-[14px] no-ligatures text-[#012A0F]",
                  }}
                />
              </div>
              <div className="bg-white xl:w-1/2 xl:pt-0 p-[20px] xl:rounded-l-[40px] flex flex-col">
                <div className="sticky hidden xl:flex top-0 left-0 right-0 bg-white z-10 px-2 py-2 justify-end">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <CloseIcon variant="secondary" className="w-6 h-6" />
                  </button>
                </div>
                <DonateAmountSection price={price} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")!
  );
};

export default KeepingModal;

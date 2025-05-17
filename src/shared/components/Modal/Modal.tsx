"use client";
import { useCallback } from "react";
import { cn } from "@/shared/utils";
import { CloseIcon } from "../../../../public/images/icons";
import { IModalProps } from "@/shared/types";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";

const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  modalClassName,
}: IModalProps) => {
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  useLockBodyScroll(isOpen);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={handleBackdropClick}
          className={cn(
            "fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]",
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={cn(
              "bg-white w-[90%] max-w-lg xl:max-w-2xl h-auto p-6 rounded-[20px] relative",
              modalClassName
            )}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-3 p-2 hover:bg-gray-100 rounded-full z-10"
            >
              <CloseIcon variant="secondary" className="w-6 h-6" />
            </button>
            <div className="overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

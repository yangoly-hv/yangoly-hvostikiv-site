"use client";

import type { KeyboardEvent, MouseEvent, PropsWithChildren } from "react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "motion/react";

import { CloseIcon } from "../../../../public/images/icons";
import FundraisingGoal from "@/shared/ui/FundraisingGoal";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";

type PaymentModalShellProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  fundraisingTitle?: string;
  goal?: string;
  currency: string;
  subtitle?: string;
  progress?: { totalAmount: number; currentAmount: number };
  showFundraisingPanel?: boolean;
}>;

const mobileGoalStyles = {
  titleClassName:
    "text-[24px]! font-arial font-black uppercase self-stretch text-center max-w-[280px] mx-auto",
  goalClassName: "text-[14px] text-[#012A0F]",
  currentAmountClassName: "text-[14px] no-ligatures text-[#012A0F]",
};

const desktopGoalStyles = {
  titleClassName:
    "text-[36px]! font-arial font-black uppercase max-w-[325px] text-center mx-auto",
  goalClassName: "text-[14px] text-[#012A0F]",
  currentAmountClassName: "text-[14px] no-ligatures text-[#012A0F]",
};

const subscribeToNothing = () => () => {};

export default function PaymentModalShell({
  isOpen,
  onClose,
  fundraisingTitle,
  goal,
  currency,
  subtitle,
  progress,
  showFundraisingPanel,
  children,
}: PaymentModalShellProps) {
  const mounted = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  useLockBodyScroll(isOpen);
  const shouldShowFundraisingPanel = showFundraisingPanel ?? Boolean(progress);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (event: MouseEvent) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, [onClose]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={fundraisingTitle || "Пожертвування"}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="relative mt-2 max-h-[90vh] w-[92%] overflow-auto rounded-[12px] bg-white scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden xl:mt-10 xl:max-h-[90vh] xl:w-[78%] xl:rounded-[40px] xl:bg-orange-bg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sticky left-0 right-0 top-0 z-10000 flex justify-end bg-white px-6 py-4 xl:hidden">
              <button onClick={onClose} aria-label="Закрити вікно пожертвування" className="rounded-full hover:bg-gray-100">
                <CloseIcon variant="secondary" className="h-6 w-6" />
              </button>
            </div>

            <div className="w-full xl:flex xl:justify-between">
              {shouldShowFundraisingPanel && (
              <FundraisingGoal
                className="xl:hidden"
                imageVariant="small"
                fundraisingTitle={fundraisingTitle ?? ""}
                goal={goal ?? ""}
                currency={currency}
                totalAmount={progress?.totalAmount ?? 0}
                currentAmount={progress?.currentAmount ?? 0}
                styles={mobileGoalStyles}
              />)}

              {shouldShowFundraisingPanel && <div className="my-auto hidden xl:block xl:w-1/2">
                <FundraisingGoal
                  imageVariant="big"
                  fundraisingTitle={fundraisingTitle ?? ""}
                  goal={goal ?? ""}
                  currency={currency}
                  totalAmount={progress?.totalAmount ?? 0}
                  currentAmount={progress?.currentAmount ?? 0}
                  subtitle={subtitle}
                  styles={desktopGoalStyles}
                />
              </div>}

              <div className={`flex flex-col bg-white p-5 xl:rounded-l-[40px] xl:pt-0 ${shouldShowFundraisingPanel ? "xl:w-1/2" : "w-full"}`}>
                <div className="sticky left-0 right-0 top-0 z-10 hidden justify-end bg-white px-2 py-2 xl:flex">
                  <button onClick={onClose} aria-label="Закрити вікно пожертвування" className="rounded-full p-2 hover:bg-gray-100">
                    <CloseIcon variant="secondary" className="h-6 w-6" />
                  </button>
                </div>
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root") ?? document.body,
  );
}

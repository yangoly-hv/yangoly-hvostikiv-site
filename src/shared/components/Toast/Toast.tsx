"use client";
import { useEffect } from "react";
import { CloseIcon } from "../../../../public/images/icons";
import { cn } from "@/shared/utils";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-1 z-[1001] flex items-center justify-between gap-2",
        "max-w-[375px] w-full bg-white px-4 py-2 rounded-[4px] border border-[#D4D4D4] shadow-lg",
        "transform transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <span className="text-[18px] leading-[133%] text-[#1D1D1D] pr-2">
        {message}
      </span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors shrink-0"
      >
        <CloseIcon className="w-4 h-4" variant="secondary" />
      </button>
    </div>
  );
};

export default Toast;

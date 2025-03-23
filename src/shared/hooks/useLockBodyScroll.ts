"use client";
import { useEffect } from "react";

export const useLockBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);
};

"use client";

import { useCallback } from "react";

export function useReturnPath() {
  return useCallback(() => {
    if (typeof window === "undefined") return "/";
    return `${window.location.pathname}${window.location.search}`;
  }, []);
}

"use client";

import { createContext, useContext, type ReactNode } from "react";

const OneTimeDonationJarContext = createContext<string | null>(null);

export function OneTimeDonationJarProvider({
  url,
  children,
}: {
  url: string | null;
  children: ReactNode;
}) {
  return (
    <OneTimeDonationJarContext.Provider value={url}>
      {children}
    </OneTimeDonationJarContext.Provider>
  );
}

export function useOneTimeDonationJarUrl() {
  return useContext(OneTimeDonationJarContext);
}

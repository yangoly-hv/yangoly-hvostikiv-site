"use client";
import { useState, useEffect } from "react";

export const useRandomCardsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setItemsPerPage(3);
      } else if (width < 1024) {
        setItemsPerPage(4);
      } else if (width < 1512) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return itemsPerPage;
};

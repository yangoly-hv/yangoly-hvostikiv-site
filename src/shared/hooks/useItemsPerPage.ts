"use client";
import { useState, useEffect } from "react";

export const useItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setItemsPerPage(3);
      } else if (width < 1512) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(8);
      }
    };

    updateItemsPerPage();

    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  return itemsPerPage;
};

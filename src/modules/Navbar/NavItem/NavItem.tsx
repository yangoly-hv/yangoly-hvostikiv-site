"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/shared/utils";
import { ArrowDonwIcon } from "../../../../public/images/icons";
import { INavigationItem } from "@/shared/types";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NavItem = ({
  item,
  isOnBurger,
  onNavClick,
}: {
  item: INavigationItem;
  isOnBurger: boolean;
  onNavClick?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const lang = pathname.split("/")[1];

  const handleDropdownItemClick = () => {
    setIsOpen(false);
    onNavClick?.();
  };

  const handleNavigation = (
    href: string | { pathname: string; query?: Record<string, string | number> }
  ) => {
    let url: string;

    if (typeof href === "string") {
      url = `/${lang}${href}`;
    } else {
      const queryString = new URLSearchParams(
        href.query as Record<string, string>
      ).toString();
      url = `/${lang}${href.pathname}?${queryString}`;
    }

    router.push(url);
    onNavClick?.();
  };

  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  if (!item.dropdown) {
    return (
      <button
        className="text-[#27272A] hover:text-[#27272A]/60 text-center text-[18px] font-normal leading-[120%]"
        onClick={() => handleNavigation(item.href)}
      >
        {item.name}
      </button>
    );
  }

  return (
    <div className={cn(isOnBurger ? "w-full" : "relative")} ref={dropdownRef}>
      <button
        className={cn(
          "text-[#27272A] text-[18px] hover:text-[#27272A]/60 font-normal leading-[120%] flex items-center gap-1",
          isOnBurger && "mr-auto "
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.name}
        <ArrowDonwIcon
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              isOnBurger
                ? "flex flex-col items-center  space-y-4 mt-4"
                : "absolute top-full -left-[115px] mt-1 bg-white shadow-lg rounded-md py-2 min-w-[250px]"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {item.dropdown.map((dropdownItem) => (
              <button
                key={dropdownItem.name}
                onClick={() => {
                  handleNavigation(dropdownItem.href);
                  handleDropdownItemClick();
                }}
                className={cn(
                  "block w-full text-left",
                  isOnBurger
                    ? "text-dark text-[18px] font-normal leading-[120%] hover:bg-gray-100 transition-colors text-left"
                    : "px-4 py-2 text-dark text-[18px] leading-[110%] hover:bg-gray-100"
                )}
              >
                {dropdownItem.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavItem;

"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Variants } from "framer-motion";
import { listItemVariants } from "./animationVariants";

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  viewport?: { once?: boolean; amount?: number };

  onClick?: () => void;
}

export default function AnimatedListItem({
  children,
  className = "",
  variants = listItemVariants,
  viewport = { once: true, amount: 0.2 },

  onClick,
}: AnimatedListItemProps) {
  return (
    <motion.li
      variants={variants}
      viewport={viewport}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.li>
  );
}

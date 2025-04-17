"use client";
import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { ElementType, PropsWithChildren } from "react";
import { fadeInAnimation } from "./animationVariants";

interface AnimatedWrapperProps extends PropsWithChildren {
  as?: ElementType;
  className?: string;
  animation?: Variants;
  viewport?: { once?: boolean; amount?: number };
}

export default function AnimatedWrapper({
  as: Component = "div",
  className = "",
  animation = fadeInAnimation({}),
  viewport = { once: true, amount: 0.2 },
  children,
}: AnimatedWrapperProps) {
  const MotionComponent = useMemo(() => motion.create(Component), [Component]);

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={viewport}
      variants={animation}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

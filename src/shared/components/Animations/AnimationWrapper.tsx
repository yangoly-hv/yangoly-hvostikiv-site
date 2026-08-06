"use client";

import type { PropsWithChildren } from "react";
import { motion, type Variants } from "motion/react";
import { fadeInAnimation } from "./animationVariants";

const motionComponents = {
  div: motion.div,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  ul: motion.ul,
} as const;

type AnimatedWrapperProps = PropsWithChildren<{
  as?: keyof typeof motionComponents;
  className?: string;
  animation?: Variants;
  viewport?: { once?: boolean; amount?: number };
}>;

export default function AnimatedWrapper({
  as = "div",
  className = "",
  animation = fadeInAnimation({}),
  viewport = { once: true, amount: 0.2 },
  children,
}: AnimatedWrapperProps) {
  const MotionComponent = motionComponents[as];

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

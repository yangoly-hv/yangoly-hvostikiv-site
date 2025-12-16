import { Variants } from "framer-motion";

type FadeInParams = {
  x?: number;
  y?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  opacity?: number;
};

export const fadeInAnimation = ({
                                  x = 0,
                                  y = 0,
                                  scale = 1,
                                  delay = 0,
                                  duration = 1,
                                  opacity = 0,
                                }: FadeInParams): Variants => ({
  hidden: {
    opacity,
    x,
    y,
    scale,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 1,
      ease: "easeIn",
    },
  },
});

export const listVariants = ({
                               staggerChildren = 0.5,
                               delayChildren = 0,
                             } = {}): Variants => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 1,
      ease: "easeIn",
    },
  },
});

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const listItemVariantSecond: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

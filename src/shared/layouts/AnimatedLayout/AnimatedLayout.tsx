import { IAnimatedSectionProps } from "@/shared/types";
import * as motion from "motion/react-client";
import { MotionProps  } from "framer-motion";

export const animations: Record<string, MotionProps> = {
  fadeIn: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.7 },
  },
  slideFromLeft: {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.7 },
  },
  slideFromRight: {
    initial: { opacity: 0, x: 100 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.7 },
  },
  slideFromTop: {
    initial: { opacity: 0, y: 100 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 1.5 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.5 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.7 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -180 },
    whileInView: { opacity: 1, rotate: 0 },
    transition: { duration: 0.7 },
  },
};
const AnimatedLayout = ({
  children,
  initial,
  whileInView,
  transition,
  amount = 0.3,
}: IAnimatedSectionProps) => (
  <motion.div
    initial={initial}
    whileInView={whileInView}
    transition={transition}
    viewport={{ once: true, amount }}
  >
    {children}
  </motion.div>
);

export default AnimatedLayout;

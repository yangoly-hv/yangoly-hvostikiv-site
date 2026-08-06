import type { PropsWithChildren } from "react";
import * as motion from "motion/react-client";
import clsx from "clsx";

type VolunteeringCardFrameProps = PropsWithChildren<{
  index: number;
  backgroundColor: string;
  className?: string;
}>;

export default function VolunteeringCardFrame({
  index,
  backgroundColor,
  className,
  children,
}: VolunteeringCardFrameProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      style={{ backgroundColor }}
      className={clsx(className)}
    >
      {children}
    </motion.li>
  );
}

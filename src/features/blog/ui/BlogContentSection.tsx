import type { PropsWithChildren } from "react";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";

type BlogContentSectionProps = PropsWithChildren<{
  className?: string;
}>;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function BlogContentSection({
  className = "w-full min-w-0",
  children,
}: BlogContentSectionProps) {
  return (
    <section className="pb-[60px]">
      <div className="container mx-auto px-4 xl:px-[40px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={revealVariants}
          className={className}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

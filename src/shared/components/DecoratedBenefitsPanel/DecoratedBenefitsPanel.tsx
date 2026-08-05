import type { PropsWithChildren } from "react";
import * as motion from "motion/react-client";
import Image from "next/image";

import { PawIcon } from "@/shared/components/Icons/PawIcon";

type DecoratedBenefitsPanelProps = PropsWithChildren<{
  title: string;
  sectionClassName: string;
  containerClassName: string;
  animalClassName: string;
  animalSrc: string;
  titleClassName: string;
  panelClassName: string;
  thirdPawClassName: string;
}>;

export default function DecoratedBenefitsPanel({
  title,
  sectionClassName,
  containerClassName,
  animalClassName,
  animalSrc,
  titleClassName,
  panelClassName,
  thirdPawClassName,
  children,
}: DecoratedBenefitsPanelProps) {
  return (
    <section className={sectionClassName}>
      <div className={containerClassName}>
        <div className={animalClassName}>
          <Image
            src={animalSrc}
            alt="animals"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className={titleClassName}
        >
          {title}
        </motion.h2>
        <div className={panelClassName}>
          <PawIcon className="absolute right-[-17px] top-[-17px] h-[81px] w-[81px] rotate-30 text-[#BB9B53] opacity-30 lg:h-[131px] lg:w-[131px]" />
          <PawIcon className="absolute left-[-17px] top-[-17px] h-[66px] w-[66px] rotate-[-44deg] text-[#BB9B53] opacity-30 lg:top-[-68px] lg:h-[131px] lg:w-[131px]" />
          <PawIcon className={thirdPawClassName} />
          <div className="relative z-10 flex flex-col gap-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

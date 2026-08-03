"use client";

import { motion } from "motion/react";

import { Link } from "@/i18n/navigation";
import type { TailViewModel } from "@/features/tails/model/types";
import RandomTailCards from "@/features/tails/ui/RandomTailCards";
import TailInfo from "@/features/tails/ui/TailInfo";
import type { AppLocale } from "@/shared/config/site";
import type { ITails } from "@/shared/types";
import { fadeIn, slideUp } from "@/shared/utils";
import { ArrowDonwIcon } from "../../../public/images/icons";

type TailProps = {
  tail: TailViewModel;
  locale: AppLocale;
  randomTails: TailViewModel[];
  translation: ITails;
};

export default function Tail({
  tail,
  randomTails,
  translation,
}: TailProps) {
  return (
    <section>
      <div className="mx-auto container pt-8 pb-5 px-4 xl:px-10">
        <TailInfo tail={tail} translation={translation} />
      </div>

      <div className="pt-10">
        <div className="container mx-auto px-4 xl:px-10">
          <div className="mt-8">
            <Link
              className="group flex justify-center lg:justify-between items-center font-arial font-black uppercase text-[24px] lg:text-[32px] leading-[130%] transition-colors duration-300 focus-visible:text-gray/60 xl:hover:text-gray/60"
              href="/tails"
            >
              <motion.h2 variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="text-dark">
                {translation.allTails}
              </motion.h2>
              <motion.div variants={slideUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}>
                <ArrowDonwIcon className="hidden lg:block rotate-270 w-6 h-6 transition-colors duration-300 group-[focus-visible]:text-primary-gray xl:group-hover:text-primary-gray" />
              </motion.div>
            </Link>
            <RandomTailCards tails={randomTails} translation={translation} />
          </div>
        </div>
      </div>
    </section>
  );
}

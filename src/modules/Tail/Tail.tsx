"use client";
import Link from "next/link";
import TailInfo from "@/shared/components/TailInfo/TailInfo";
import RandomTailCards from "@/shared/components/RandomTailCards/RandomTailCards";
import { ArrowDonwIcon } from "../../../public/images/icons";
// import { ITailProps } from "@/shared/types";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/shared/utils";

import {getTailData} from "@/shared/utils/functions";

//@ts-expect-error
export default function Tail({tail, locale, randomTails, translation}) {
  const { allTails } = translation;
  const transformTail = getTailData(tail, locale);
  //@ts-expect-error
  const transformRandomTails = randomTails.map(tail => getTailData(tail, locale))
  return (
    <section>
      <div className="mx-auto container pt-8 pb-5 px-4 xl:px-10">
        {/*@ts-expect-error*/}
        <TailInfo tail={transformTail} locale={locale} translation={translation} />
      </div>

      <div className="pt-10">
        <div className="container mx-auto px-4 xl:px-10">
          <div className="mt-8">
            <Link
              className="group flex justify-center lg:justify-between items-center font-arial font-black uppercase text-[24px] lg:text-[32px]
              leading-[130%] transition-colors duration-300 focus-visible:text-gray/60 xl:hover:text-gray/60"
              href="/tails"
            >
              <motion.h2
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="text-dark"
              >
                {allTails}
              </motion.h2>
              <motion.div
                variants={slideUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
              >
                <ArrowDonwIcon
                  className="hidden lg:block rotate-[270deg] w-6 h-6 transition-colors duration-300 group-[focus-visible]:text-primary-gray
                  xl:group-hover:text-primary-gray"
                />
              </motion.div>
            </Link>
            <RandomTailCards tails={transformRandomTails} translation={translation} />
          </div>
        </div>
      </div>
    </section>
  );
}

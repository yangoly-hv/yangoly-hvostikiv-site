"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/shared/utils";

import Link from "next/link";
import Button from "@/shared/components/Button/Button";

const localeErrorText = {
    uk: "Нажаль, цю сторінку на українській мові не знайдено",
    en: "Unfortunately this page in English was not found."
};

const localeToMainText = {
    uk: "На головну сторінку",
    en: "To main page"
}

const NotFoundLocale = ({locale})=> {
    return (
        <section className="mx-auto container pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px] px-4 xl:px-10 mb-[100px]">
            <div className="justify-between gap-x-[141px]  lg:mb-12">
                <div className="mb-[44px] lg:mb-0">
                    <motion.h2
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        custom={0}
                        className="mb-7 text-[24px] lg:text-[32px] font-bold leading-[130%]"
                    >
                        {localeErrorText[locale]}
                    </motion.h2>
                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        className="w-full"
                        custom={0.8}
                    >
                        <Link href="/">
                            <Button
                                // onClick={() => router.back()}
                                className="py-3 text-[14px] font-semibold xl:text-[18px]"
                                text={localeToMainText[locale]}
                            />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
)
}

export default NotFoundLocale;

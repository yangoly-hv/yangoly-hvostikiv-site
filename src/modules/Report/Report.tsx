"use client";

import Image from "next/image";
import Link from "next/link";
import ReportSlider from "@/modules/Report/ReportSlider";
import HelpTabs from "@/modules/Report/HelpTabs";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/shared/utils";
import Button from "@/shared/components/Button/Button";
import PortableTextRender from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from './portableTextComponents'
const TAB_CONFIG = [
    {
        id: 'food',
        title: 'Допомога кормом',
        description:
            'У вересні фонд «Янголи Хвостиків» передав понад 250 кг корму для тварин. Ми зробили це спільно з партнерами й небайдужими людьми, що турбуються про хвостиків навіть на відстані.',
        cta: 'Детальніше про допомогу кормом',
        iconSrc: '/images/donation-form/bath.svg',
        field: 'foodDescription',
    },
    {
        id: 'house',
        title: 'Житло для хвостиків',
        description:
            'У вересні ми разом із небайдужими людьми закрили збір на 178 000 грн на будівництво котобудинку. Завдяки цим коштам 50 котиків, яких евакуювали з прифронтової зони, отримають теплий і безпечний дім.',
        cta: 'Детальніше про житло для хвостиків',
        iconSrc: '/images/donation-form/shop.svg',
        field: 'houseDescription',
    },
    {
        id: 'therapy',
        title: 'Лікування хвостиків',
        description:
            `У вересні ми також зібрали 56 035 грн на стерилізацію й вакцинацію хвостиків із Миколаївщини та Донеччини.
 Це черговий крок до того, щоб кожен хвостик мав шанс на здорове й безпечне життя.`,
        cta: 'Детальніше про лікування',
        iconSrc: '/images/donation-form/syringe.svg',
        field: 'therapyDescription',
    },
    {
        id: 'other',
        title: 'Інше',
        description:
            `У вересні ми також зібрали 56 035 грн на стерилізацію й вакцинацію хвостиків із Миколаївщини та Донеччини.
 Це черговий крок до того, щоб кожен хвостик мав шанс на здорове й безпечне життя.`,
        cta: 'Детальніше про іншу допомогу',
        iconSrc: '/images/donation-form/other.svg',
        field: 'otherDescription',
    },
];

function buildTabsFromReport(report) {
    return TAB_CONFIG
        .filter(tab => Array.isArray(report?.[tab.field]) && report[tab.field].length)
        .map(tab => ({
            id: tab.id,
            title: tab.title,
            description: tab.description,
            iconSrc: tab.iconSrc,
            // ⬇️ ВАЖНО: здесь уже JSX
            content: (
                <PortableText
                    value={report[tab.field]}
                    components={portableTextComponents}
                />
            ),
        }))
}
//@ts-expect-error
export default function Report({ translation, report }) {
    const { date, title, images } = report;
    console.log(JSON.stringify(report.foodDescription, null, 2));
    const tabs = buildTabsFromReport(report);

    return (
        <section className="pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px]">
            {/* ================= TEXT BLOCK (container) ================= */}
            <div className="mx-auto container px-4 xl:px-10">
                <div className="lg:flex items-center justify-between gap-x-[141px] mb-[44px] lg:mb-[60px]">
                    <div className="lg:w-[70.3%]">
                        <motion.h2
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={0}
                            className="font-arial font-normal mb-[12px] text-[18px] lg:text-[24px] leading-[130%]"
                        >
                            {date}
                        </motion.h2>

                        <motion.h1
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={0.2}
                            className="font-arial uppercase mb-[32px] lg:mb-[44px] text-[24px] lg:text-[32px] font-normal leading-[130%]"
                        >
                            {title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* ================= SLIDER (FULL WIDTH ON DESKTOP) ================= */}
            <div className="mb-[60px] lg:mb-[96px]">
                <ReportSlider images={images} />
            </div>

            {/* ================= BOTTOM TEXT (container) ================= */}
            <div className="mx-auto container px-4 xl:px-10">
                <div className="text-[14px] lg:text-[18px] font-light leading-[130%]">
                    {/* <PortableTextRender value={additionalInfo} /> */}
                    <HelpTabs tabs={tabs} />
                </div>
            </div>
        </section>
    );
}

"use client";

// import Image from "next/image";
// import Link from "next/link";
import ReportSlider from "@/modules/Report/ReportSlider";
import HelpTabs from "@/modules/Report/HelpTabs";
import { motion } from "framer-motion";
import { fadeIn, slideUp } from "@/shared/utils";
// import Button from "@/shared/components/Button/Button";
// import PortableTextRender from "@/shared/components/PortableTextRenderer/PortableTextRenderer";
import { PortableText } from '@portabletext/react'
import { portableTextComponents } from './portableTextComponents'
const TAB_CONFIG = [
    {
        id: 'food',
        title: 'Допомога кормом',
        description:
            'У вересні фонд «Янголи Хвостиків» передав понад 250 кг корму для тварин. Ми зробили це спільно з партнерами й небайдужими людьми, що турбуються про хвостиків навіть на відстані.',
        cta: 'Детальніше про допомогу кормом',
        iconSrc: '/images/reports/food.svg',
        shortField: 'shortFoodDescription',
        field: 'foodDescription',
    },
    {
        id: 'house',
        title: 'Житло для хвостиків',
        description:
            'У вересні ми разом із небайдужими людьми закрили збір на 178 000 грн на будівництво котобудинку. Завдяки цим коштам 50 котиків, яких евакуювали з прифронтової зони, отримають теплий і безпечний дім.',
        cta: 'Детальніше про житло для хвостиків',
        iconSrc: '/images/reports/house.svg',
        shortField: 'shortHouseDescription',
        field: 'houseDescription',
    },
    {
        id: 'therapy',
        title: 'Лікування хвостиків',
        description:
            `У вересні ми також зібрали 56 035 грн на стерилізацію й вакцинацію хвостиків із Миколаївщини та Донеччини.
 Це черговий крок до того, щоб кожен хвостик мав шанс на здорове й безпечне життя.`,
        cta: 'Детальніше про лікування',
        iconSrc: '/images/reports/drug.svg',
        shortField: 'shortTherapyDescription',
        field: 'therapyDescription',
    },
    {
        id: 'other',
        title: 'Інше',
        description:
            `У вересні ми також зібрали 56 035 грн на стерилізацію й вакцинацію хвостиків із Миколаївщини та Донеччини.
 Це черговий крок до того, щоб кожен хвостик мав шанс на здорове й безпечне життя.`,
        cta: 'Детальніше про іншу допомогу',
        iconSrc: '/images/reports/other.svg',
        shortField: 'shortOtherDescription',
        field: 'otherDescription',
    },
];

const getPortableTextText = (value) =>
    value
        ?.map((block) =>
            block.children?.map((child) => child.text || "").join("") || ""
        )
        .join(" ")
        .replace(/\s+/g, " ")
        .trim() || "";

const truncateText = (text, max = 180) => {
    if (!text) return "";
    if (text.length <= max) return text;

    const cut = text.slice(0, max);

    // если есть законченная фраза — берём её
    const sentenceMatch = cut.match(/^(.*[.!?…])(?=\s|$)/);
    if (sentenceMatch && sentenceMatch[1]) return sentenceMatch[1];

    // иначе режем по последнему слову
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + "…";
};

export const getReportText = (report, tab) => {
    const shortText = getPortableTextText(report?.[tab.shortField]);

    if (shortText) return shortText;

    const fullText = getPortableTextText(report?.[tab.field]);

    return truncateText(fullText, 180);
};

function buildTabsFromReport(report) {
    return TAB_CONFIG
        .filter(tab => Array.isArray(report?.[tab.field]) && report[tab.field].length)
        .map(tab => ({
            id: tab.id,
            title: tab.title,
            description: getReportText(report, tab),
            iconSrc: tab.iconSrc,
            cta: tab.cta,
            content: (
                <PortableText
                    value={report[tab.field]}
                    components={portableTextComponents}
                />
            ),
        }))
}

export default function Report({ translation, report }) {
    const { date, title } = report;
    const images = report.images ?? [];
    const hasImages = images.length > 0;

    const tabs = buildTabsFromReport(report);

    return (
        <section className="pt-[60px] xl:pt-12 pb-[100px] xl:pb-[148px]">
            {/* ================= TEXT BLOCK (container) ================= */}
            <div className="mx-auto container px-4 xl:px-10">
                <div className="lg:flex items-center justify-between gap-x-[141px] mb-[32px] lg:mb-[44px]">
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
                            className="font-arial uppercase text-[24px] lg:text-[32px] font-normal leading-[130%]"
                        >
                            {title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            {hasImages && (
                <div className="mb-[32px] lg:mb-[44px]">
                    <ReportSlider images={images} />
                </div>
            )}

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

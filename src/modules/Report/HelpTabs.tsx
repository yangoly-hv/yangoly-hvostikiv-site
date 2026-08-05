"use client";

import {useState} from "react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import HelpTabCard from "@/modules/Report/HelpTabCard";
import {fadeIn} from "@/shared/utils";
import type { ReportTab } from "./types";

type ReportFileLinkProps = {
    href?: string;
    text: string;
    className?: string;
};

type HelpTabsProps = {
    tabs: ReportTab[];
    reportFileUrl?: string;
    viewReportButtonText: string;
};

function ReportFileLink({href, text, className = ""}: ReportFileLinkProps): ReactNode {
    if (!href) {
        return null
    }

    return (
        <motion.a
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true}}
            custom={0.4}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center rounded-[28px] bg-green px-6 py-3 text-center text-[14px] font-bold uppercase leading-[110%] text-white transition-all duration-300 ease-in-out hover:brightness-125 active:scale-95 xl:text-[18px] ${className}`}
        >
            {text}
        </motion.a>
    )
}

export default function HelpTabs({ tabs, reportFileUrl, viewReportButtonText }: HelpTabsProps) {
    const [desktopActiveTab, setDesktopActiveTab] = useState(tabs[0]?.id ?? '')
    const [mobileActiveTab, setMobileActiveTab] = useState('')
    const desktopActiveTabData = tabs.find(t => t.id === desktopActiveTab)

    return (
        <>
            {/* ===== DESKTOP ===== */}
            <div className="hidden lg:grid grid-cols-2 gap-6">

                {/* LEFT: NAVIGATION */}
                <div className="flex flex-col gap-4">
                    {tabs.map(tab => (
                        <HelpTabCard
                            key={tab.id}
                            title={tab.title}
                            description={tab.description}
                            cta={tab.cta}
                            iconSrc={tab.iconSrc}
                            isActive={tab.id === desktopActiveTab}
                            onClick={() => setDesktopActiveTab(tab.id)}
                        />
                    ))}
                    <ReportFileLink
                        href={reportFileUrl}
                        text={viewReportButtonText}
                        className="mt-2"
                    />
                </div>

                {/* RIGHT: CONTENT */}
                {desktopActiveTabData && (
                    <div className="bg-white rounded-[10px] py-[32px] px-[20px] lg:px-[64px]">
                        <p className="font-arial font-normal uppercase text-[24px] lg:text-[32px] mb-[16px] lg:mb-[32px]">{desktopActiveTabData.title}</p>
                        {desktopActiveTabData.content}
                    </div>
                )}
            </div>

            {/* ===== MOBILE ===== */}
            <div className="lg:hidden space-y-4">
                {tabs.map(tab => {
                    const isOpen = tab.id === mobileActiveTab

                    return (
                        <div key={tab.id}>
                            <HelpTabCard
                                title={tab.title}
                                description={tab.description}
                                cta={tab.cta}
                                iconSrc={tab.iconSrc}
                                isActive={isOpen}
                                onClick={() =>
                                    setMobileActiveTab(isOpen ? '' : tab.id)
                                }
                            />

                            {isOpen && (
                                <div className="relative top-[-16px] lg:top-0 bg-white rounded-[10px] pt-[42px] pb-[24px] lg:py-[32px] px-[20px] lg:px-[64px]">
                                    <p className="font-arial font-normal uppercase text-[24px] lg:text-[32px] mb-[16px] lg:mb-[32px] leading-[130%]">{tab.title}</p>
                                    {tab.content}
                                </div>
                            )}
                        </div>
                    )
                })}
                <ReportFileLink
                    href={reportFileUrl}
                    text={viewReportButtonText}
                    className="mt-6"
                />
            </div>
        </>
    )
}

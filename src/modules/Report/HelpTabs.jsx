import {useState} from "react";

import HelpTabCard from "@/modules/Report/HelpTabCard";

export default function HelpTabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(tabs[0].id)

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
                            isActive={tab.id === activeTab}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>

                {/* RIGHT: CONTENT */}
                <div className="bg-white rounded-[10px] py-[32px] px-[20px] lg:px-[64px]">
                    {tabs.find(t => t.id === activeTab)?.content}
                </div>
            </div>

            {/* ===== MOBILE ===== */}
            <div className="lg:hidden space-y-4">
                {tabs.map(tab => {
                    const isOpen = tab.id === activeTab

                    return (
                        <div key={tab.id}>
                            <HelpTabCard
                                title={tab.title}
                                description={tab.description}
                                cta={tab.cta}
                                icon={tab.icon}
                                isActive={isOpen}
                                onClick={() =>
                                    setActiveTab(isOpen ? '' : tab.id)
                                }
                            />

                            {isOpen && (
                                <div className="bg-white rounded-[10px] pb-[24px] lg:py-[32px] px-[20px] lg:px-[64px]">
                                    {tab.content}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </>
    )
}

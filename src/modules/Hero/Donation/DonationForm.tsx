'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import Button from "@/shared/components/Button/Button";
import {onceImages} from "@/modules/Hero/Donation/donationIcons";
import { useOneTimeDonationJarUrl } from "@/providers/OneTimeDonationJarProvider";
import SafeImage from "@/shared/components/SafeImage/SafeImage";
import { trackMonoDonateClick } from "@/shared/lib/metaPixel";

const onceValues = [100, 200, 600, 1500] as const;

function AmountIllustration({ value }: { value: (typeof onceValues)[number] }) {
    const t = useTranslations('DonationForm');
    const icon = onceImages[onceValues.indexOf(value)] ?? onceImages[0];
    if (!icon) return null;

    return (
        <>
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_14px_-6px_rgba(0,0,0,0.45)] lg:h-[46px] lg:w-[46px]">
                <SafeImage
                    key={icon.alt}
                    src={icon.src}
                    alt={icon.alt}
                    width={icon.w}
                    height={icon.h}
                    className="h-[30px] w-auto lg:h-[27px]"
                />
            </div>
            <div>
                <div className="numeric-font text-[22px] font-bold leading-[130%] text-white lg:text-[19px]">
                    {value} ₴
                </div>
                <div className="mt-[2px] text-[13px] leading-[130%] tracking-[-0.2px] text-white/80 lg:text-[12px]">
                    {t(`onceItems.${value}`)}
                </div>
            </div>
        </>
    );
}

function TabPill({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center gap-[10px] rounded-full border border-white/25 bg-green/85 px-[20px] py-[9px] text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(76,123,103,0.9),inset_0_1px_0_rgba(255,255,255,0.35)] xl:text-[14px]">
            <span aria-hidden="true" className="relative flex h-[8px] w-[8px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 motion-reduce:hidden" />
                <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-white" />
            </span>
            {label}
        </span>
    );
}

// On phones the form starts folded to the pill, unfolds on the first bit of
// scrolling (or a tap) and folds back at the very top; from lg upward it is
// always fully expanded. A tap-open sticks until the next scroll cycle.
const UNFOLD_SCROLL_Y = 16;
const FOLD_SCROLL_Y = 6;

export default function DonationForm() {
    const t = useTranslations('DonationForm');
    const jarUrl = useOneTimeDonationJarUrl();
    const [open, setOpen] = useState(false);
    const manualOpen = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            if (y > UNFOLD_SCROLL_Y) {
                manualOpen.current = false;
                setOpen(true);
            } else if (y < FOLD_SCROLL_Y && !manualOpen.current) {
                setOpen(false);
            }
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="liquid-glass w-full max-w-[524px] rounded-[28px] px-[16px] py-[20px] text-white sm:px-[24px] lg:max-w-[460px] lg:py-[28px] xl:max-w-[524px] xl:p-[32px]">
            <div className="relative z-10">
                <button
                    type="button"
                    onClick={() => {
                        manualOpen.current = true;
                        setOpen(true);
                    }}
                    aria-expanded={open}
                    aria-controls="donation-form-body"
                    className="flex w-full flex-col items-center gap-[6px] lg:hidden"
                >
                    <TabPill label={t('tabs.once')} />
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`h-[18px] w-[18px] text-white/80 transition-all duration-500 ${
                            open
                                ? 'mt-[-2px] rotate-180 opacity-0'
                                : 'animate-bounce motion-reduce:animate-none'
                        }`}
                    >
                        <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <div className="hidden justify-center lg:flex">
                    <TabPill label={t('tabs.once')} />
                </div>
                <div
                    id="donation-form-body"
                    className={`grid transition-[grid-template-rows,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:grid-rows-[1fr] lg:opacity-100 ${
                        open
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0'
                    }`}
                >
                <div className="min-h-0 overflow-hidden">
                <p className="mt-[10px] text-center text-[15px] leading-[140%] text-white/90 lg:mt-[18px] xl:text-[14px]">
                    {t("descriptions.once")}
                </p>
                <div className="mt-[22px] grid grid-cols-1 gap-[12px] sm:grid-cols-2 xl:gap-[13px]">
                    {onceValues.map((value) => (
                        <div
                            key={value}
                            className="liquid-glass-chip flex min-w-0 items-center gap-[14px] rounded-[16px] px-[14px] py-[10px] text-left lg:gap-[15px] xl:min-h-[72px]"
                        >
                            <AmountIllustration value={value} />
                        </div>
                    ))}
                </div>
                {jarUrl ? (
                    <div className="mt-[24px] pb-[4px]">
                        <Button
                            text={t('submit')}
                            href={jarUrl}
                            onClick={trackMonoDonateClick}
                            className="w-full rounded-[24px] shadow-[0_14px_36px_-10px_rgba(76,123,103,0.95)] hover:shadow-[0_16px_44px_-8px_rgba(76,123,103,1)] xl:h-[53px] lg:text-[14px]"
                        />
                    </div>
                ) : null}
                </div>
                </div>
            </div>
        </div>
    );
}

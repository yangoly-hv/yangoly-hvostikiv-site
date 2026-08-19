'use client';

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

export default function DonationForm() {
    const t = useTranslations('DonationForm');
    const jarUrl = useOneTimeDonationJarUrl();

    return (
        <div className="liquid-glass w-full max-w-[524px] rounded-[28px] px-[16px] py-[28px] text-white sm:px-[24px] lg:max-w-[460px] xl:max-w-[524px] xl:p-[32px]">
            <div className="relative z-10">
                <div className="flex justify-center">
                    <p className="inline-flex items-center gap-[10px] rounded-full border border-white/25 bg-green/85 px-[20px] py-[9px] text-[15px] font-semibold text-white shadow-[0_8px_24px_-10px_rgba(76,123,103,0.9),inset_0_1px_0_rgba(255,255,255,0.35)] xl:text-[14px]">
                        <span aria-hidden="true" className="relative flex h-[8px] w-[8px]">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 motion-reduce:hidden" />
                            <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-white" />
                        </span>
                        {t("tabs.once")}
                    </p>
                </div>
                <p className="mt-[18px] text-center text-[15px] leading-[140%] text-white/90 xl:text-[14px]">
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
                    <div className="mt-[24px]">
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
    );
}

'use client';

import { useTranslations } from 'next-intl';

import Button from "@/shared/components/Button/Button";
import {onceImages} from "@/modules/Hero/Donation/donationIcons";
import { useOneTimeDonationJarUrl } from "@/providers/OneTimeDonationJarProvider";
import SafeImage from "@/shared/components/SafeImage/SafeImage";

const onceValues = [100, 200, 600, 1500] as const;

function AmountIllustration({ value }: { value: (typeof onceValues)[number] }) {
    const t = useTranslations('DonationForm');
    const icon = onceImages[onceValues.indexOf(value)] ?? onceImages[0];
    if (!icon) return null;

    return (
        <>
            <div className="flex justify-center items-center h-[56px] w-[56px] lg:size-[45px] shrink-0 rounded-[4px] bg-[rgba(76, 123, 103, 0.1)]">
                <SafeImage
                    key={icon.alt}
                    src={icon.src}
                    alt={icon.alt}
                    width={icon.w}
                    height={icon.h}
                />
            </div>
            <div>
                <div className="text-[24px] lg:text-[19px] font-semibold leading-[130%]">
                    {value} ₴
                </div>
                <div className="mt-1 text-[14px] lg:text-[11px] leading-[130%] tracking-[-0.66px]">
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
        <div className="max-w-[524px] rounded-[8px] bg-white px-[16px] pb-[25px] xl:p-[25px] py-[32px] shadow-md">
            <div className="mb-[24px] xl:mb-[25px] rounded-[10px] border-2 border-green">
                <p className="rounded-[8px] py-2 px-4 text-center text-[16px] xl:text-[14px] bg-green text-white font-semibold">
                    {t("tabs.once")}
                </p>
            </div>
            <p className="mb-[24px] xl:mb-[25px] text-center text-[16px] xl:text-[14px] xl:leading-[130%]">
                {t("descriptions.once")}
            </p>
            <div className="space-y-4 xl:space-y-[25px] lg:px-[6px]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-[13px]">
                    {onceValues.map((value) => (
                        <div
                            key={value}
                            className="flex items-center gap-3 lg:gap-[19px] rounded-[10px] px-[16px] py-[8px] text-left border-2 border-[#828282] xl:px-[14px] xl:py-0 xl:min-h-[69px]"
                        >
                            <AmountIllustration value={value} />
                        </div>
                    ))}
                </div>
                {jarUrl ? (
                    <div className="pt-4">
                        <Button
                            text={t('submit')}
                            href={jarUrl}
                            className="w-full mb-3 desk:mb-8 xl:h-[53px] lg:text-[14px] rounded-[22px]"
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

'use client';

import {useMemo, useState} from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import Image from "next/image";
import clsx from 'clsx';

import Button from "@/shared/components/Button/Button";

import {onceImages, monthlyImages} from "@/modules/Hero/Donation/donationIcons";
import axios from "axios";
import {usePathname, useSearchParams} from "next/navigation";

import donate from "@/shared/lib/donate";

type Tab = 'once' | 'monthly';

interface FormValues {
    amount: number | '';
}
// #4C7B671A
const onceValues = [100, 200, 600, 1500];
const monthlyValues = [250, 500, 1000, 1500, 2500];

export default function DonationForm() {
    const t = useTranslations('DonationForm');
    const [tab, setTab] = useState<Tab>('once');

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const returnPath = useMemo(() => {
        const query = searchParams.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    const { register, setValue, watch, handleSubmit } = useForm<FormValues>({
        defaultValues: { amount: tab === "once" ? 100 : 250 },
    });

    const amount = watch('amount');
    const values = tab === 'once' ? onceValues : monthlyValues;

    const onSubmit = async () => {
        if(amount) {
            await donate({amount, returnPath});
        }

        // const {data} = await axios.post("/api/wayforpay/checkout", {
        //     amount,
        //     orderReference: `DONATE_${Date.now()}`,
        //     productName: "Донат для фонду Янголи хвостиків",
        //     returnPath,
        // });
        //
        // const form = document.createElement("form");
        // form.method = "POST";
        // form.action = "https://secure.wayforpay.com/pay";
        //
        // Object.keys(data).forEach((key) => {
        //     const input = document.createElement("input");
        //     input.type = "hidden";
        //     input.name = key;
        //     input.value = Array.isArray(data[key]) ? data[key].join(";") : data[key];
        //     form.appendChild(input);
        // });
        //
        // document.body.appendChild(form);
        // form.submit();
    };

    //
    // const onSubmit = (data: FormValues) => {
    //     console.log({ type: tab, amount: data.amount });
    // };

    const icons = tab === "once" ? onceImages : monthlyImages;

    return (
        <div className="max-w-[524px] rounded-[8px] bg-white px-[16px] xl:p-[25px] py-[32px] shadow-md xl:max-h-[478px]">
            {/* Tabs */}
            <div className="mb-[24px] xl:mb-[25px] grid grid-cols-2 rounded-[10px] border-2 border-[#4C7B67]">
                {(['once', 'monthly'] as Tab[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => {
                            setValue("amount", tab === "once" ? 250 : 100);
                            setTab(key);
                        }}
                        className={clsx(
                            'rounded-[8px] py-2 px-4 xl:px-0 text-[16px] xl:text-[14px] transition',
                            tab === key
                                ? 'bg-[#4C7B67] text-white font-semibold'
                                : 'text-black'
                        )}
                    >
                        {t(`tabs.${key}`)}
                    </button>
                ))}
            </div>

            {/* Description */}
            <p className="mb-[24px] xl:mb-[25px] text-center text-[16px] xl:text-[14px] xl:leading-[130%]">
                {t(`descriptions.${tab}`)}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 xl:space-y-[25px] lg:px-[6px]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-[13px]">
                    {values.map((value, idx) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setValue('amount', value)}
                            className={clsx(
                                'flex items-center gap-3 lg:gap-[19px] rounded-[10px] px-[16px] py-[8px] text-left transition xl:px-[14px] xl:py-0 xl:min-h-[69px]',
                                amount === value
                                    ? 'border-2 border-[#4C7B67] bg-[#4C7B67]/20'
                                    : 'border-2 border-[#828282]'
                            )}
                        >
                            <div className={`flex justify-center items-center h-[56px] w-[56px] lg:size-[45px] shrink-0 rounded-[4px] ${amount === value ? "bg-white" : "bg-[rgba(76, 123, 103, 0.1)]"}`}>
                                <Image
                                    key={icons[idx].alt}
                                    src={icons[idx].src}
                                    alt={icons[idx].alt}
                                    width={icons[idx].w}
                                    height={icons[idx].h}
                                />
                            </div>

                            <div>
                                <div className="text-[24px] lg:text-[19px] font-semibold leading-[130%]">
                                    {value} ₴
                                    {tab === 'monthly' && (
                                        <span> / міс</span>
                                    )}
                                </div>
                                <div className="mt-1 text-[14px] lg:text-[11px] leading-[130%]">
                                    {t(`${tab}Items.${value}`)}
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* Custom amount */}
                    <div className="flex items-start xl:items-center gap-3 xl:gap-[19px] rounded-[16px] border border-[#D1D1D1] p-4 xl:py-0 lx:px-3 xl:h-[58px]">
                        <div
                            className={`flex justify-center items-center h-[56px] w-[56px] xl:size-[45px] shrink-0 rounded-[4px] bg-[rgba(76, 123, 103, 0.1)]`}>
                            <Image
                                key={icons[5].alt}
                                src={icons[5].src}
                                alt={icons[5].alt}
                                width={icons[5].w}
                                height={icons[5].h}
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="number"
                                placeholder={t('customAmount.placeholder')}
                                className="w-full placeholder:text-[#4C7B67] placeholder:text-[14px] placeholder:leading-[130%] rounded-[8px] border border-[#4C7B67] px-3 py-1 text-sm xl:h-[25px] xl:text-[10px] bg-[#F5F5F5] focus:outline-none"
                                {...register('amount')}
                            />
                            <div className="mt-2 text-sm xl:text-[11px] xl:mt-[3px]">
                                {t('customAmount.label')}
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    // onClick={() => setIsDonateModalOpen(true)}
                    onClick={onSubmit}
                    text={t('submit')}
                    className="w-full mb-3 desk:mb-8 xl:h-[53px] lg:text-[14px] rounded-[22px]"
                    type="button"
                ></Button>
                {/*<button*/}
                {/*    type="submit"*/}
                {/*    className="mt-6 w-full rounded-[28px] bg-[#4C7B67] py-4 text-sm font-semibold text-white"*/}
                {/*>*/}
                {/*    {t('submit')}*/}
                {/*</button>*/}
            </form>
        </div>
    );
}

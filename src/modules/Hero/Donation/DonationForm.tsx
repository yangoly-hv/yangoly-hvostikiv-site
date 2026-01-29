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
const onceValues = [100, 250, 500, 1000, 2500];
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
        <div className="max-w-[660px] rounded-[8px] bg-white px-[16px] xl:px-[32px]  py-[32px] shadow-md">
            {/* Tabs */}
            <div className="mb-[24px] xl:mb-[32px] grid grid-cols-2 rounded-[10px] border-2 border-[#4C7B67]">
                {(['once', 'monthly'] as Tab[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => {
                            setValue("amount", tab === "once" ? 250 : 100);
                            setTab(key);
                        }}
                        className={clsx(
                            'rounded-[8px] py-2 px-4 xl:px-0 text-[16px] xl:text-[18px] transition',
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
            <p className="mb-[24px] xl:mb-[32px] text-center text-[16px] xl:text-[18px]">
                {t(`descriptions.${tab}`)}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {values.map((value, idx) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setValue('amount', value)}
                            className={clsx(
                                'flex items-center gap-3 rounded-[10px] px-[16px] py-[8px] text-left transition',
                                amount === value
                                    ? 'border-2 border-[#4C7B67] bg-[#4C7B67]/20'
                                    : 'border-[1.5px] border-[#828282]'
                            )}
                        >
                            <div className={`flex justify-center items-center h-[56px] w-[56px] shrink-0 rounded-[4px] ${amount === value ? "bg-white" : "bg-[rgba(76, 123, 103, 0.1)]"}`}>
                                <Image
                                    key={icons[idx].alt}
                                    src={icons[idx].src}
                                    alt={icons[idx].alt}
                                    width={icons[idx].w}
                                    height={icons[idx].h}
                                />
                            </div>

                            <div>
                                <div className="text-[24px] font-semibold leading-[130%]">
                                    {value} ₴
                                    {tab === 'monthly' && (
                                        <span> / міс</span>
                                    )}
                                </div>
                                <div className="mt-1 text-[14px] leading-[130%]">
                                    {t(`${tab}Items.${value}`)}
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* Custom amount */}
                    <div className="flex items-start gap-3 rounded-[16px] border border-[#D1D1D1] p-4">
                        <div
                            className={`flex justify-center items-center h-[56px] w-[56px] shrink-0 rounded-[4px] bg-[rgba(76, 123, 103, 0.1)]`}>
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
                                className="w-full placeholder:text-[#4C7B67] placeholder:text-[14px] placeholder:leading-[130%] rounded-[8px] border border-[#4C7B67] px-3 py-1 text-sm bg-[#F5F5F5] focus:outline-none"
                                {...register('amount')}
                            />
                            <div className="mt-2 text-sm">
                                {t('customAmount.label')}
                            </div>
                        </div>
                    </div>
                </div>
                <Button
                    // onClick={() => setIsDonateModalOpen(true)}
                    onClick={onSubmit}
                    text={t('submit')}
                    className="w-full mb-3 desk:mb-8 xl:h-[67px]"
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

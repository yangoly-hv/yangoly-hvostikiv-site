'use client';

import {useState} from 'react';
import { Controller } from "react-hook-form";
import { useTranslations } from 'next-intl';
import Image from "next/image";
import clsx from 'clsx';

import Button from "@/shared/components/Button/Button";
import CheckBox from "@/shared/components/CheckBox/CheckBox";
import PublicOfferLink from "@/shared/components/PublicOfferLink/PublicOfferLink";
import TextInput from "@/shared/components/TextInput/TextInput";

import {onceImages, monthlyImages} from "@/modules/Hero/Donation/donationIcons";

import { useDonationCheckout } from "@/features/donation/model/useDonationCheckout";

type Tab = 'once' | 'monthly';

const onceValues = [100, 200, 600, 1500];
const monthlyValues = [250, 500, 1000, 1500, 2500];

export default function DonationForm() {
    const t = useTranslations('DonationForm');
    const [tab, setTab] = useState<Tab>('once');
    const [donationItemDescription, setDonationItemDescription] = useState(() => t("onceItems.100"));

    const { register, setValue, watch, submit, formState, control, submitError } = useDonationCheckout({
        initialAmount: 100,
        donationItemDescription,
        donationSchedule: "oneTime",
    });

    const amount = watch('amount');
    const isAnonymous = watch('isAnonymous');
    const isAgreed = watch('isAgreed');
    const isRecurringAgreed = watch('isRecurringAgreed');
    const amountField = register('amount', { valueAsNumber: true });
    const values = tab === 'once' ? onceValues : monthlyValues;

    const handleTabChange = (nextTab: Tab) => {
        if (nextTab === tab) return;

        setTab(nextTab);
        setValue("amount", nextTab === "once" ? 100 : 250, {
            shouldValidate: true,
        });
        setValue("donationSchedule", nextTab === "monthly" ? "monthly" : "oneTime", {
            shouldValidate: true,
        });
        setValue("isRecurringAgreed", false, { shouldValidate: true });
        setDonationItemDescription(t(`${nextTab}Items.${nextTab === "once" ? 100 : 250}`));
    };

    const icons = tab === "once" ? onceImages : monthlyImages;
    const fallbackIcon = icons[0];
    const customIcon = icons[5];

    if (!fallbackIcon || !customIcon) return null;

    return (
        <div className="max-w-[524px] rounded-[8px] bg-white px-[16px] pb-[25px] xl:p-[25px] py-[32px] shadow-md">
            {/* Tabs */}
            <div className="mb-[24px] xl:mb-[25px] grid grid-cols-2 rounded-[10px] border-2 border-green">
                {(['once', 'monthly'] as Tab[]).map((key) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => handleTabChange(key)}
                        className={clsx(
                            'rounded-[8px] py-2 px-4 xl:px-0 text-[16px] xl:text-[14px] transition',
                            tab === key
                                ? 'bg-green text-white font-semibold'
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

            <form onSubmit={submit} className="space-y-4 xl:space-y-[25px] lg:px-[6px]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:gap-[13px]">
                    {values.map((value, idx) => {
                        const icon = icons[idx] ?? fallbackIcon;
                        return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => {
                                setValue('amount', value, { shouldValidate: true });
                                setDonationItemDescription(t(`${tab}Items.${value}`));
                            }}
                            className={clsx(
                                'flex items-center gap-3 lg:gap-[19px] rounded-[10px] px-[16px] py-[8px] text-left transition xl:px-[14px] xl:py-0 xl:min-h-[69px]',
                                amount === value
                                    ? 'border-2 border-green bg-green/20'
                                    : 'border-2 border-[#828282]'
                            )}
                        >
                            <div className={`flex justify-center items-center h-[56px] w-[56px] lg:size-[45px] shrink-0 rounded-[4px] ${amount === value ? "bg-white" : "bg-[rgba(76, 123, 103, 0.1)]"}`}>
                                <Image
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
                                    {tab === 'monthly' && (
                                        <span> / міс</span>
                                    )}
                                </div>
                                <div className="mt-1 text-[14px] lg:text-[11px] leading-[130%] tracking-[-0.66px]">
                                    {t(`${tab}Items.${value}`)}
                                </div>
                            </div>
                        </button>
                        );
                    })}

                    {/* Custom amount */}
                    <div className="flex items-start xl:items-center gap-3 xl:gap-[19px] rounded-[16px] border border-[#D1D1D1] p-4 xl:py-0 xl:px-3 xl:min-h-[69px] min-h-0 self-stretch">
                        <div
                            className={`flex justify-center items-center h-[56px] w-[56px] xl:size-[45px] shrink-0 rounded-[4px] bg-[rgba(76, 123, 103, 0.1)]`}>
                            <Image
                                key={customIcon.alt}
                                src={customIcon.src}
                                alt={customIcon.alt}
                                width={customIcon.w}
                                height={customIcon.h}
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="number"
                                placeholder={t('customAmount.placeholder')}
                                className="w-full placeholder:text-green placeholder:text-[14px] placeholder:leading-[130%] rounded-[8px] border border-green px-3 py-1 text-sm xl:h-[25px] xl:text-[10px] bg-[#F5F5F5] focus:outline-hidden"
                                {...amountField}
                                onChange={(event) => {
                                    amountField.onChange(event);
                                    setDonationItemDescription(t('customAmount.label'));
                                }}
                            />
                            <div className="mt-2 text-sm xl:text-[11px] xl:mt-[3px]">
                                {t('customAmount.label')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-4">
                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field }) => (
                            <TextInput
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                label={t("fullNameLabel")}
                                placeholder={t("fullNamePlaceholder")}
                                disabled={isAnonymous}
                            />
                        )}
                    />
                </div>
                <Controller
                    control={control}
                    name="isAnonymous"
                    render={({ field }) => (
                        <CheckBox
                            label={t("anonymousLabel")}
                            checked={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="isAgreed"
                    render={({ field }) => (
                        <CheckBox
                            label={<PublicOfferLink text={t("agreementLabel")} />}
                            checked={field.value}
                            onChange={field.onChange}
                            error={Boolean(formState.errors.isAgreed)}
                            required
                        />
                    )}
                />
                {tab === "monthly" && (
                    <Controller
                        control={control}
                        name="isRecurringAgreed"
                        render={({ field }) => (
                            <CheckBox
                                label={t("recurringAgreementLabel", { amount: amount ?? 0 })}
                                checked={field.value}
                                onChange={field.onChange}
                                error={Boolean(formState.errors.isRecurringAgreed)}
                                required
                            />
                        )}
                    />
                )}
                <div className="pt-4">
                    <Button
                        text={t('submit')}
                        className="w-full mb-3 desk:mb-8 xl:h-[53px] lg:text-[14px] rounded-[22px]"
                        disabled={
                            formState.isSubmitting ||
                            !amount ||
                            amount <= 0 ||
                            !isAgreed ||
                            (tab === "monthly" && !isRecurringAgreed)
                        }
                        type="submit"
                    ></Button>
                </div>
                {submitError && (
                    <p className="text-center text-sm font-medium text-red-600" role="alert">
                        {t("submitError")}
                    </p>
                )}
            </form>
        </div>
    );
}

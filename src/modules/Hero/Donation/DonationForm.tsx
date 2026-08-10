'use client';

import { useCallback, useEffect, useId, useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Controller, type Control, type UseFormStateReturn } from "react-hook-form";
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'motion/react';

import Button from "@/shared/components/Button/Button";
import CheckBox from "@/shared/components/CheckBox/CheckBox";
import PublicOfferLink from "@/shared/components/PublicOfferLink/PublicOfferLink";
import TextInput from "@/shared/components/TextInput/TextInput";
import SafeImage from "@/shared/components/SafeImage/SafeImage";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";
import { CloseIcon } from "../../../../public/images/icons";

import { useDonationCheckout } from "@/features/donation/model/useDonationCheckout";
import type { DonationFormValues } from "@/features/donation/model/schema";
import { onceImages, monthlyImages } from "@/modules/Hero/Donation/donationIcons";
import {
  isCustomHighlighted,
  isPresetHighlighted,
  type AmountSelectionMode,
} from "@/modules/Hero/Donation/amountSelection";

type Tab = 'once' | 'monthly';

const onceValues = [100, 200, 600, 1500];
const monthlyValues = [250, 500, 1000, 1500, 2500];
const LG_QUERY = "(min-width: 1024px)";

function subscribeLg(onStoreChange: () => void) {
  const media = window.matchMedia(LG_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function useIsLgUp() {
  return useSyncExternalStore(
    subscribeLg,
    () => window.matchMedia(LG_QUERY).matches,
    () => true
  );
}

type DonorFieldsProps = {
  tab: Tab;
  amount: number | undefined;
  control: Control<DonationFormValues>;
  formState: UseFormStateReturn<DonationFormValues>;
  isAnonymous: boolean;
  isAgreed: boolean;
  isRecurringAgreed: boolean;
  submitError: boolean;
  className?: string;
};

function DonorFields({
  tab,
  amount,
  control,
  formState,
  isAnonymous,
  isAgreed,
  isRecurringAgreed,
  submitError,
  className,
}: DonorFieldsProps) {
  const t = useTranslations('DonationForm');

  return (
    <div className={clsx("space-y-4 xl:space-y-5 text-neutral-900", className)}>
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
      <div className="pt-2 pb-16 lg:pb-2">
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
        />
      </div>
      {submitError && (
        <p className="text-center text-sm font-medium text-red-700" role="alert">
          {t("submitError")}
        </p>
      )}
    </div>
  );
}

function DonationExpandSheet({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const titleId = useId();
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-1000 flex items-end justify-center lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col rounded-t-[20px] bg-white px-4 pt-3 pb-4 shadow-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-neutral-300" />
            <div className="mb-2 flex items-center justify-between">
              <h2 id={titleId} className="text-[16px] font-semibold text-neutral-900">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 hover:bg-neutral-100"
                aria-label="Close"
              >
                <CloseIcon variant="secondary" className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function DonationForm() {
  const t = useTranslations('DonationForm');
  const isLgUp = useIsLgUp();
  const [tab, setTab] = useState<Tab>('once');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState<AmountSelectionMode>('none');
  const [customInput, setCustomInput] = useState('');
  const [donationItemDescription, setDonationItemDescription] = useState(() => t("onceItems.100"));

  const { setValue, watch, submit, formState, control, submitError } = useDonationCheckout({
    initialAmount: 100,
    donationItemDescription,
    donationSchedule: "oneTime",
  });

  const amount = watch('amount');
  const isAnonymous = watch('isAnonymous');
  const isAgreed = watch('isAgreed');
  const isRecurringAgreed = watch('isRecurringAgreed');
  const values = tab === 'once' ? onceValues : monthlyValues;
  const icons = tab === "once" ? onceImages : monthlyImages;
  const fallbackIcon = icons[0];
  const customIcon = icons[5];

  const openExpand = useCallback(() => {
    if (isLgUp) {
      setIsExpanded(true);
      setIsSheetOpen(false);
    } else {
      setIsSheetOpen(true);
      setIsExpanded(false);
    }
  }, [isLgUp]);

  const closeExpand = useCallback(() => {
    setIsExpanded(false);
    setIsSheetOpen(false);
  }, []);

  useEffect(() => {
    if (isLgUp) {
      if (isSheetOpen) {
        setIsSheetOpen(false);
        setIsExpanded(true);
      }
    } else if (isExpanded) {
      setIsExpanded(false);
      setIsSheetOpen(true);
    }
    // Only sync UI when the breakpoint flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLgUp]);

  const handleTabChange = (nextTab: Tab) => {
    if (nextTab === tab) return;

    setTab(nextTab);
    closeExpand();
    setSelectionMode('none');
    setCustomInput('');
    setValue("amount", nextTab === "once" ? 100 : 250, {
      shouldValidate: true,
    });
    setValue("donationSchedule", nextTab === "monthly" ? "monthly" : "oneTime", {
      shouldValidate: true,
    });
    setValue("isRecurringAgreed", false, { shouldValidate: true });
    setDonationItemDescription(t(`${nextTab}Items.${nextTab === "once" ? 100 : 250}`));
  };

  const selectAmount = (value: number) => {
    setValue('amount', value, { shouldValidate: true });
    setDonationItemDescription(t(`${tab}Items.${value}`));
    setSelectionMode('preset');
    setCustomInput('');
    openExpand();
  };

  const onCustomChange = (raw: string) => {
    setCustomInput(raw);
    setSelectionMode('custom');
    const parsed = Number(raw);
    setValue('amount', Number.isFinite(parsed) ? parsed : 0, { shouldValidate: true });
    setDonationItemDescription(t('customAmount.label'));
    openExpand();
  };

  if (!fallbackIcon || !customIcon) return null;

  const donorFields = (
    <DonorFields
      tab={tab}
      amount={amount}
      control={control}
      formState={formState}
      isAnonymous={Boolean(isAnonymous)}
      isAgreed={Boolean(isAgreed)}
      isRecurringAgreed={Boolean(isRecurringAgreed)}
      submitError={Boolean(submitError)}
    />
  );

  return (
    <div className="max-w-[524px] rounded-[16px] border border-neutral-200 bg-white px-4 pb-6 pt-6 xl:p-[25px] text-neutral-900 shadow-[0_8px_32px_rgba(0,0,0,0.16)]">
      <div className="mb-4 xl:mb-5 grid grid-cols-2 rounded-[10px] border-2 border-green bg-white">
        {(['once', 'monthly'] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleTabChange(key)}
            className={clsx(
              'rounded-[8px] py-2 px-4 xl:px-0 text-[16px] xl:text-[14px] transition',
              tab === key
                ? 'bg-green text-white font-semibold'
                : 'text-neutral-900 font-medium hover:bg-neutral-100'
            )}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </div>

      <p className="mb-4 xl:mb-5 text-center text-[14px] xl:text-[13px] leading-[130%] text-neutral-900">
        {t(`descriptions.${tab}`)}
      </p>

      <form onSubmit={submit} className="space-y-4 xl:space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:gap-[13px]">
          {values.map((value, idx) => {
            const icon = icons[idx] ?? fallbackIcon;
            const selected = isPresetHighlighted(selectionMode, values, amount, value);
            return (
              <button
                key={value}
                type="button"
                onClick={() => selectAmount(value)}
                className={clsx(
                  'flex items-center gap-3 lg:gap-[19px] rounded-[10px] px-[16px] py-[8px] text-left transition xl:px-[14px] xl:py-0 xl:min-h-[69px]',
                  selected
                    ? 'border-2 border-green bg-green/20'
                    : 'border-2 border-[#828282]'
                )}
              >
                <div
                  className={clsx(
                    'flex justify-center items-center h-[56px] w-[56px] lg:size-[45px] shrink-0 rounded-[4px]',
                    selected ? 'bg-white' : 'bg-[rgba(76,123,103,0.1)]'
                  )}
                >
                  <SafeImage
                    key={icon.alt}
                    src={icon.src}
                    alt={icon.alt}
                    width={icon.w}
                    height={icon.h}
                  />
                </div>
                <div>
                  <div className="text-[24px] lg:text-[19px] font-semibold leading-[130%] text-neutral-900">
                    {value} ₴
                    {tab === 'monthly' && <span> / міс</span>}
                  </div>
                  <div className="mt-1 text-[14px] lg:text-[11px] leading-[130%] tracking-[-0.66px] text-neutral-800">
                    {t(`${tab}Items.${value}`)}
                  </div>
                </div>
              </button>
            );
          })}

          <div
            className={clsx(
              'flex items-start xl:items-center gap-3 xl:gap-[19px] rounded-[16px] border-2 p-4 xl:py-0 xl:px-3 xl:min-h-[69px] min-h-0 self-stretch',
              isCustomHighlighted(selectionMode)
                ? 'border-green bg-green/20'
                : 'border-[#D1D1D1]'
            )}
          >
            <div className="flex justify-center items-center h-[56px] w-[56px] xl:size-[45px] shrink-0 rounded-[4px] bg-[rgba(76,123,103,0.1)]">
              <SafeImage
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
                inputMode="numeric"
                placeholder={t('customAmount.placeholder')}
                value={customInput}
                aria-label={t('customAmount.label')}
                className="w-full placeholder:text-green placeholder:text-[14px] placeholder:leading-[130%] rounded-[8px] border border-green px-3 py-1 text-sm xl:h-[25px] xl:text-[10px] bg-[#F5F5F5] text-neutral-900 focus:outline-hidden"
                onFocus={() => {
                  setSelectionMode((mode) => (mode === 'none' ? 'custom' : mode));
                  openExpand();
                }}
                onChange={(event) => onCustomChange(event.target.value)}
              />
              <div className="mt-2 text-sm xl:text-[11px] xl:mt-[3px] text-neutral-800">
                {t('customAmount.label')}
              </div>
            </div>
          </div>
        </div>

        {isLgUp && isExpanded && (
          <div className="pt-1 border-t border-neutral-200">
            {donorFields}
          </div>
        )}
      </form>

      <DonationExpandSheet
        isOpen={!isLgUp && isSheetOpen}
        onClose={closeExpand}
        title={t('submit')}
      >
        <form onSubmit={submit}>{donorFields}</form>
      </DonationExpandSheet>
    </div>
  );
}

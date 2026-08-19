"use client";

import { motion } from "motion/react";

type GoalProgressProps = {
  percent: number;
  currentLabel: string;
  goalLabel: string;
  currentFormatted: string;
  goalFormatted: string;
};

export default function GoalProgress({
  percent,
  currentLabel,
  goalLabel,
  currentFormatted,
  goalFormatted,
}: GoalProgressProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="mx-auto w-full lg:max-w-[348px] xl:max-w-[555px]">
      <div className="flex items-end justify-between gap-4">
        <div className="text-left">
          <span className="text-[11px] uppercase tracking-[0.08em] text-dark/60 xl:text-[13px]">
            {currentLabel}
          </span>
          <div className="numeric-font font-arial text-[18px] leading-[120%] text-green xl:text-[26px]">
            {currentFormatted} ₴
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] uppercase tracking-[0.08em] text-dark/60 xl:text-[13px]">
            {goalLabel}
          </span>
          <div className="numeric-font font-arial text-[14px] font-semibold leading-[120%] text-dark/75 xl:text-[18px]">
            {goalFormatted} ₴
          </div>
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={`${currentLabel}: ${currentFormatted} ₴ / ${goalFormatted} ₴`}
        className="relative mt-[10px] h-[18px] overflow-hidden rounded-full border border-green/15 bg-green/10 xl:h-[22px]"
      >
        <motion.div
          className="relative h-full min-w-[18px] overflow-hidden rounded-full bg-gradient-to-r from-green to-green-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
          initial={{ width: "4%" }}
          whileInView={{ width: `${clamped}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <span aria-hidden="true" className="progress-shimmer" />
        </motion.div>
      </div>
      <motion.div
        className="numeric-font mt-[8px] text-center text-[13px] font-bold text-green xl:text-[15px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        {clamped}%
      </motion.div>
    </div>
  );
}

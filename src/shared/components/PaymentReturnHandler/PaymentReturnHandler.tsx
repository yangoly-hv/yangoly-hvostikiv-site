"use client";

import { useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { isPaymentStatus, type PaymentStatus } from "@/features/donation/model/payment";
import { useModal } from "@/providers/ModalProvider";

const maxStatusChecks = 15;
const statusCheckIntervalMs = 1_000;

const sleep = (ms: number, signal: AbortSignal) => new Promise<void>((resolve) => {
  const id = window.setTimeout(resolve, ms);
  signal.addEventListener("abort", () => { window.clearTimeout(id); resolve(); }, { once: true });
});

export default function PaymentReturnHandler() {
  const pathname = usePathname();
  const t = useTranslations("PaymentReturn");
  const { openThankYouModal, openPaymentStatusModal } = useModal();

  const cleanUrl = useCallback((orderReference: string) => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("orderReference") !== orderReference) return;
    params.delete("payment");
    params.delete("orderReference");
    window.history.replaceState(null, "", params.size ? `${pathname}?${params}` : pathname);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;
    const params = new URLSearchParams(window.location.search);
    const orderReference = params.get("orderReference");
    if (params.get("payment") !== "processing" || !orderReference) return;
    const controller = new AbortController();

    const showStatus = (status: Exclude<PaymentStatus, "approved" | "created" | "pending">) => {
      cleanUrl(orderReference);
      openPaymentStatusModal({ title: t(`${status}.title`), message: t(`${status}.message`), buttonText: t("buttonText") });
    };
    const checkPaymentStatus = async () => {
      for (let attempt = 0; attempt < maxStatusChecks && !controller.signal.aborted; attempt += 1) {
        try {
          const response = await fetch(`/api/wayforpay/status?${new URLSearchParams({ orderReference })}`, { cache: "no-store", signal: controller.signal });
          const data: unknown = await response.json().catch(() => null);
          const status = data && typeof data === "object" && "status" in data && isPaymentStatus(data.status) ? data.status : undefined;
          if (response.ok && status === "approved") { cleanUrl(orderReference); openThankYouModal(); return; }
          if (response.ok && (status === "failed" || status === "reversed" || status === "unknown")) { showStatus(status); return; }
        } catch (error) {
          if (controller.signal.aborted) return;
        }
        if (attempt < maxStatusChecks - 1) await sleep(statusCheckIntervalMs, controller.signal);
      }
      if (!controller.signal.aborted) {
        openPaymentStatusModal({
          title: t("pending.title"),
          message: t("pending.message"),
          buttonText: t("buttonText"),
          onButtonClick: () => window.location.reload(),
        });
      }
    };
    void checkPaymentStatus();
    return () => controller.abort();
  }, [pathname, cleanUrl, openPaymentStatusModal, openThankYouModal, t]);

  return null;
}

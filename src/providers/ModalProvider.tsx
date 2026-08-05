"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { IThankYouModalProps } from "@/shared/types";
import type { DonationTarget } from "@/features/donation/model/purpose";

const DonateModal = dynamic(
    () => import("@/shared/components/DonateModal/DonateModal"),
    { ssr: false },
);

const ThankYouModal = dynamic(
    () => import("@/shared/components/DonateModal/ThankYouModal/ThankYouModal"),
    { ssr: false },
);

/* =======================
   Types
======================= */

type ModalContextType = {
    openDonateModal: (title: string, donationTarget?: DonationTarget) => void;
    openThankYouModal: () => void;
    openPaymentStatusModal: (content: PaymentStatusModalContent) => void;
    closeDonateModal: () => void;
    closeThankYouModal: () => void;
    closePaymentStatusModal: () => void;
};

type DonateModalState = {
    open: boolean;
    title?: string;
    donationTarget?: DonationTarget;
};

type PaymentStatusModalContent = Pick<
    IThankYouModalProps,
    "title" | "message" | "buttonText" | "onButtonClick"
>;

type PaymentStatusModalState = PaymentStatusModalContent & {
    open: boolean;
};

/* =======================
   Context
======================= */

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within ModalProvider");
    }
    return context;
};

/* =======================
   Provider
======================= */

export default function ModalProvider({
                                          children,
                                      }: {
    children?: ReactNode;
}) {
    const [donateModal, setDonateModal] = useState<DonateModalState>({
        open: false,
    });

    const [thankYouOpen, setThankYouOpen] = useState(false);
    const [paymentStatusModal, setPaymentStatusModal] = useState<PaymentStatusModalState>({
        open: false,
    });

    /* ===== Donate modal ===== */

    const openDonateModal = (title: string, donationTarget?: DonationTarget) => {
        setDonateModal({ open: true, title, donationTarget });
    };

    const closeDonateModal = () => {
        setDonateModal({ open: false });
    };

    /* ===== Thank you modal ===== */

    const openThankYouModal = () => {
        setThankYouOpen(true);
    };

    const closeThankYouModal = () => {
        setThankYouOpen(false);
    };

    const openPaymentStatusModal = (content: PaymentStatusModalContent) => {
        setPaymentStatusModal({ open: true, ...content });
    };

    const closePaymentStatusModal = () => {
        setPaymentStatusModal({ open: false });
    };

    return (
        <ModalContext.Provider
            value={{
                openDonateModal,
                closeDonateModal,
                openThankYouModal,
                closeThankYouModal,
                openPaymentStatusModal,
                closePaymentStatusModal,
            }}
        >
            {children}

            {donateModal.open && (
                <DonateModal
                    isOpen
                    title={donateModal.title}
                    donationTarget={donateModal.donationTarget}
                    onClose={closeDonateModal}
                />
            )}

            {thankYouOpen && (
                <ThankYouModal
                    isOpen
                    onClose={closeThankYouModal}
                />
            )}

            {paymentStatusModal.open && (
                <ThankYouModal
                    isOpen
                    onClose={closePaymentStatusModal}
                    title={paymentStatusModal.title}
                    message={paymentStatusModal.message}
                    buttonText={paymentStatusModal.buttonText}
                    onButtonClick={paymentStatusModal.onButtonClick}
                />
            )}
        </ModalContext.Provider>
    );
}

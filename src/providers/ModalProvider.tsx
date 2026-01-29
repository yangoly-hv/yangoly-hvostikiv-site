"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";
import DonateModal from "@/shared/components/DonateModal/DonateModal";
import ThankYouModal from "@/shared/components/DonateModal/ThankYouModal/ThankYouModal";

/* =======================
   Types
======================= */

type ModalContextType = {
    openDonateModal: (title: string) => void;
    openThankYouModal: () => void;
    closeDonateModal: () => void;
    closeThankYouModal: () => void;
};

type DonateModalState = {
    open: boolean;
    title?: string;
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

    /* ===== Donate modal ===== */

    const openDonateModal = (title: string) => {
        setDonateModal({ open: true, title });
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

    return (
        <ModalContext.Provider
            value={{
                openDonateModal,
                closeDonateModal,
                openThankYouModal,
                closeThankYouModal,
            }}
        >
            {children}

            <DonateModal
                isOpen={donateModal.open}
                title={donateModal.title}
                onClose={closeDonateModal}
            />

            <ThankYouModal
                isOpen={thankYouOpen}
                onClose={closeThankYouModal}
            />
        </ModalContext.Provider>
    );
}

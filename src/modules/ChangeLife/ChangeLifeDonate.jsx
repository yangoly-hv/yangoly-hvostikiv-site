"use client";

import Button from "../../shared/components/Button/Button";
import {useState} from "react";
import DonateModal from "../../shared/components/DonateModal/DonateModal";

export default function ChangeLifeDonate({text}) {
    const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const handleDonateModalClose = () => {
        setIsDonateModalOpen(false);
    };
    return (
        <>
            <Button
                onClick={() => setIsDonateModalOpen(true)}
                variant="outline"
                text={text}
                fullWidth
                className="w-full xl:h-[67px]"
            />
            <DonateModal
                isOpen={isDonateModalOpen}
                onClose={handleDonateModalClose}
            />
        </>
    )
}

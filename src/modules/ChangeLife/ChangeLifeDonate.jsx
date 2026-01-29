"use client";

import Button from "../../shared/components/Button/Button";
// import {useState} from "react";
import {useModal} from "@/providers/ModalProvider";
import {useTranslations} from "next-intl";
// import DonateModal from "../../shared/components/DonateModal/DonateModal";

export default function ChangeLifeDonate({text}) {
    // const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const t = useTranslations("DonateModal");
    // const handleDonateModalClose = () => {
    //     setIsDonateModalOpen(false);
    // };
    const {openDonateModal} = useModal();
    return (
        <>
            <Button
                onClick={() => openDonateModal(t("fundraisingOneTimeTitle"))}
                variant="outline"
                text={text}
                fullWidth
                className="w-full xl:h-[67px] bg-inherit text-dark border-dark hover:text-white hover:bg-dark"
            />
            {/*<DonateModal*/}
            {/*    isOpen={isDonateModalOpen}*/}
            {/*    onClose={handleDonateModalClose}*/}
            {/*/>*/}
        </>
    )
}

"use client";

import Button from "../../shared/components/Button/Button";
import {useModal} from "@/providers/ModalProvider";
import {useTranslations} from "next-intl";

export default function ChangeLifeDonate({ text }: { text: string }) {
    const t = useTranslations("DonateModal");
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
        </>
    )
}

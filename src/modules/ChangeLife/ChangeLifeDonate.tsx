"use client";

import Button from "../../shared/components/Button/Button";
import { useOneTimeDonationJarUrl } from "@/providers/OneTimeDonationJarProvider";

export default function ChangeLifeDonate({ text }: { text: string }) {
    const jarUrl = useOneTimeDonationJarUrl();
    if (!jarUrl) return null;

    return (
        <Button
            href={jarUrl}
            variant="outline"
            text={text}
            fullWidth
            className="w-full xl:h-[67px] bg-inherit text-dark border-dark hover:text-white hover:bg-dark"
        />
    )
}

"use client";

import { Link } from "@/i18n/navigation";
import Button from "@/shared/components/Button/Button";
import { trackStartPartnershipClick } from "@/shared/lib/metaPixel";

export default function ChangeLifePartnerCta({ text }: { text: string }) {
  return (
    <Link
      href="/partnership"
      className="block w-full"
      onClick={trackStartPartnershipClick}
    >
      <Button className="w-full xl:h-[67px]" text={text} />
    </Link>
  );
}

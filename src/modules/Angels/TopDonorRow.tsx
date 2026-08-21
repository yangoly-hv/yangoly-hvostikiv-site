import clsx from "clsx";
import type { TopDonor } from "@/features/home/model/types";
import { imageUrlForSlot } from "@/shared/lib/sanityImage";
import SafeImage from "@/shared/components/SafeImage/SafeImage";
import SocialIconLink from "@/shared/components/SocialIconLink/SocialIconLink";
import { InstagramIcon, TelegramIcon } from "../../../public/images/icons";
import { GlobeIcon } from "./GlobeIcon";

const rankBadgeStyles: Record<number, string> = {
  1: "bg-[linear-gradient(135deg,#FFE3B3,#FFC46B)] text-dark shadow-[0_2px_8px_rgba(255,196,107,0.5)]",
  2: "bg-[linear-gradient(135deg,#F3F3F3,#C9C9C9)] text-dark shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
  3: "bg-[linear-gradient(135deg,#F0D9BC,#D9A96C)] text-dark shadow-[0_2px_8px_rgba(217,169,108,0.4)]",
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 })
    .format(value)
    .replace(/ /g, " ");

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

type TopDonorRowProps = {
  donor: TopDonor;
  rank: number;
  companyLabel: string;
  hrn: string;
};

const TopDonorRow = ({ donor, rank, companyLabel, hrn }: TopDonorRowProps) => {
  const isCompany = donor.kind === "company";
  const imageUrl = isCompany
    ? donor.image?.url
      ? `${donor.image.url}?w=320&fit=max&auto=format`
      : ""
    : imageUrlForSlot(donor.image, "donorAvatar");

  return (
    <div className="group flex items-center gap-3 rounded-[16px] bg-white/55 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-colors duration-300 hover:bg-white/85 md:gap-4 md:rounded-[18px] md:px-4 md:py-3">
      <span
        className={clsx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-arial text-[13px] leading-none xl:h-10 xl:w-10 xl:text-[16px]",
          rankBadgeStyles[rank] ?? "bg-white/70 text-dark/50"
        )}
      >
        {rank}
      </span>

      <span
        className={clsx(
          "relative block h-11 w-11 shrink-0 overflow-hidden xl:h-13 xl:w-13",
          isCompany ? "rounded-[12px] bg-white" : "rounded-full"
        )}
      >
        {imageUrl ? (
          <SafeImage
            src={imageUrl}
            alt={donor.name}
            fill
            sizes="56px"
            className={isCompany ? "object-contain p-1.5" : "object-cover"}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eaccaa,#709480)] font-arial text-[13px] text-white xl:text-[16px]">
            {getInitials(donor.name)}
          </span>
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-semibold leading-[130%] xl:text-[16px]">
          {donor.name}
        </span>
        <span className="mt-0.5 flex items-center gap-2.5">
          {isCompany && (
            <span className="rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-green xl:text-[11px]">
              {companyLabel}
            </span>
          )}
          <span className="flex items-center gap-2">
            <SocialIconLink href={donor.instagramUrl} label={`${donor.name} — Instagram`}>
              <InstagramIcon width={17} height={17} />
            </SocialIconLink>
            <SocialIconLink href={donor.telegramUrl} label={`${donor.name} — Telegram`}>
              <TelegramIcon width={17} height={17} />
            </SocialIconLink>
            <SocialIconLink href={donor.websiteUrl} label={`${donor.name} — Website`}>
              <GlobeIcon width={16} height={16} />
            </SocialIconLink>
          </span>
        </span>
      </span>

      <span className="shrink-0 whitespace-nowrap text-right font-arial text-[13px] leading-none xl:text-[16px]">
        {formatAmount(donor.amount)}
        <span className="ml-1 text-[10px] font-normal text-dark/50 xl:text-[12px]">
          {hrn}
        </span>
      </span>
    </div>
  );
};

export default TopDonorRow;

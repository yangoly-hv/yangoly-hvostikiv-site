import type { Volunteer } from "@/features/home/model/types";
import { imageUrlForSlot } from "@/shared/lib/sanityImage";
import SafeImage from "@/shared/components/SafeImage/SafeImage";
import LiquidGlass from "@/shared/components/LiquidGlass/LiquidGlass";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from "../../../public/images/icons";
import SocialIconLink from "../TopDonors/SocialIconLink";

type VolunteerCardProps = {
  volunteer: Volunteer;
  contributionLabel: string;
};

const VolunteerCard = ({ volunteer, contributionLabel }: VolunteerCardProps) => {
  const photoUrl = imageUrlForSlot(volunteer.photo, "volunteerPhoto");
  const hasSocials = Boolean(
    volunteer.instagramUrl || volunteer.telegramUrl || volunteer.facebookUrl
  );

  return (
    <LiquidGlass className="flex h-full flex-col p-3 md:p-4" radiusClassName="rounded-[20px]">
      <div className="relative mb-4 aspect-[8/9] overflow-hidden rounded-[14px]">
        {photoUrl ? (
          <SafeImage
            src={photoUrl}
            alt={volunteer.name}
            fill
            sizes="(min-width: 1366px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eaccaa,#709480)] font-arial text-[28px] text-white">
            {volunteer.name[0]?.toUpperCase()}
          </span>
        )}
      </div>
      <h3 className="font-arial text-[16px] leading-[130%] xl:text-[20px]">
        {volunteer.name}
      </h3>
      <p className="mt-1.5 text-[13px] leading-[145%] text-dark/70 xl:text-[15px]">
        {volunteer.description}
      </p>
      <div className="mt-auto pt-3">
        {volunteer.contribution && (
          <p className="mb-3 inline-flex max-w-full items-baseline gap-1.5 rounded-full bg-green/10 px-3 py-1.5 text-[12px] leading-[130%] xl:text-[13px]">
            <span className="shrink-0 font-semibold uppercase tracking-[0.05em] text-green">
              {contributionLabel}:
            </span>
            <span className="text-dark/80">{volunteer.contribution}</span>
          </p>
        )}
        {hasSocials && (
          <div className="flex items-center gap-3">
            <SocialIconLink
              href={volunteer.instagramUrl}
              label={`${volunteer.name} — Instagram`}
            >
              <InstagramIcon width={20} height={20} />
            </SocialIconLink>
            <SocialIconLink
              href={volunteer.telegramUrl}
              label={`${volunteer.name} — Telegram`}
            >
              <TelegramIcon width={20} height={20} />
            </SocialIconLink>
            <SocialIconLink
              href={volunteer.facebookUrl}
              label={`${volunteer.name} — Facebook`}
            >
              <FacebookIcon width={20} height={20} />
            </SocialIconLink>
          </div>
        )}
      </div>
    </LiquidGlass>
  );
};

export default VolunteerCard;

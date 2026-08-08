import * as motion from "motion/react-client";
import clsx from "clsx";
import { getSafeHref, isExternalWebHref } from "@/shared/lib/safeHref";
import { listItemVariants } from "@/shared/components/Animations/animationVariants";
import SafeImage from "@/shared/components/SafeImage/SafeImage";
import { cn } from "@/shared/utils";
import type { Partner } from "./data";

type PartnersListItemProps = {
  partner: Partner;
  buttonText: string;
};

const PartnersListItem = ({ partner, buttonText }: PartnersListItemProps) => {
  const href = getSafeHref(partner.websiteUrl) || "#";
  const isExternal = isExternalWebHref(href);

  return (
    <motion.div
      variants={listItemVariants}
      viewport={{ once: true, amount: 0.2 }}
      initial="hidden"
      whileInView="visible"
      className={clsx(
        "bg-white rounded-[8px] flex flex-col h-full overflow-hidden"
      )}
    >
      <div className="relative h-[148px] lg:h-[188px] border-b border-solid border-orange">
        <SafeImage
          src={partner.logoUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-contain p-6 lg:p-8"
        />
      </div>

      <div className="h-[82px] lg:h-[115px] px-[25px] lg:px-[32px] flex flex-col items-center justify-center">
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer nofollow" : undefined}
          className={cn(
            "uppercase h-[42px] lg:h-[67px] flex items-center justify-center rounded-[28px] text-[14px] xl:text-[18px] leading-[110%] font-bold",
            "text-white bg-green hover:brightness-125 active:scale-95 transition-all duration-300",
            "block text-center w-full"
          )}
        >
          <span className="inline-flex h-full min-w-0 items-center justify-center text-center">{buttonText}</span>
        </a>
      </div>
    </motion.div>
  );
};

export default PartnersListItem;

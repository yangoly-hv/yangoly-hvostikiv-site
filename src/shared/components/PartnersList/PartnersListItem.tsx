import * as motion from "motion/react-client";
import { IPartnerItem } from "@/shared/types";
import clsx from "clsx";
import Image from "next/image";
import { listItemVariants } from "../Animations/animationVariants";
import { cn } from "@/shared/utils";

const PartnersListItem = ({ partner }: { partner: IPartnerItem }) => {
  const href = partner.buttonLink || "#";
  const isExternal = href.startsWith("http");

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
      <div
        className={clsx(
          "h-[148px] lg:h-[188px] flex items-center justify-center",
          !partner.image.bg && "border-b border-solid border-orange"
        )}
        style={partner.image.bg ? { backgroundColor: partner.image.bg } : {}}
      >
        <Image
          src={partner.image.imagePath}
          alt={partner.title}
          width={partner.image.widthMob}
          height={partner.image.heightMob}
          className="block lg:hidden"
        />
        <Image
          src={partner.image.imagePath}
          alt={partner.title}
          width={partner.image.widthDesk}
          height={partner.image.heightDesk}
          className="hidden lg:block"
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
          <span className="inline-flex h-full min-w-0 items-center justify-center text-center">{partner.buttonText}</span>
        </a>
      </div>
    </motion.div>
  );
};

export default PartnersListItem;

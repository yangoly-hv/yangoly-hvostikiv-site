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
          "h-[123px] lg:h-[251px] flex items-center justify-center",
          !partner.image.bg && "border-b border-solid border-[#EACCAA]"
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

      <div className="px-[18px] lg:px-[24px] py-5 flex flex-col items-center justify-center">
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={cn(
            "uppercase py-3 px-6 rounded-[28px] text-[14px] xl:text-[18px] leading-[110%] font-bold",
            "text-white bg-green hover:brightness-125 active:scale-95 transition-all duration-300",
            "inline-block text-center w-full max-w-[240px]"
          )}
        >
          {partner.buttonText}
        </a>
      </div>
    </motion.div>
  );
};

export default PartnersListItem;

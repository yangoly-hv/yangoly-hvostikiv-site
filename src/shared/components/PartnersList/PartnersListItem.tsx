import * as motion from "motion/react-client";
import { IPartnerItem } from "@/shared/types";
import clsx from "clsx";
import Image from "next/image";
import Button from "../Button/Button";
import { listItemVariants } from "../Animations/animationVariants";

const PartnersListItem = ({ partner }: { partner: IPartnerItem }) => {
  return (
    <motion.div
      variants={listItemVariants}
      viewport={{ once: true, amount: 0.2 }}
      initial="hidden"
      whileInView="visible"
      className={clsx(
        "bg-white rounded-[8px] lg:min-h-[539px] flex flex-col h-full overflow-hidden "
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

      <div className="px-[5px] lg:px-[69px] flex flex-col flex-grow mt-4 pb-[20px]">
        <div className="mb-auto">
          <h2 className="font-arial leading-[130%] text-center uppercase text-[20px] lg:text-[32px]">
            {partner.title}
          </h2>
          <p className="mt-3 text-[14px] leading-[130%] text-center lg:text-[18px]">
            {partner.text}
          </p>
        </div>
        <div className="flex justify-center mt-5">
          <Button
            className="w-[278px] h-[42px] lg:w-[569px] lg:h-[67px]"
            text={partner.buttonText}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PartnersListItem;

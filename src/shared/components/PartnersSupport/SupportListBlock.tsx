import { IPartnersSupport } from "@/shared/types";
import * as motion from "motion/react-client";
import Image from "next/image";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";

const SupportListBlock = ({ data }: { data: IPartnersSupport }) => {
  return (
    <div>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="text-[18px] leading-[130%] font-bold mb-2 lg:text-[32px]"
      >
        {data.title}
      </motion.h3>
      <motion.ul
        className="flex flex-col gap-2 p-[10px] lg:px-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {data.list.map((item, index) => (
          <motion.li
            key={index}
            variants={listItemVariants}
            className="py-[10px] px-[6px] lg:px-0 flex items-center gap-[10px]"
          >
            {item.imgPath && (
              <Image
                src={item.imgPath}
                alt="Support Icon"
                width={44}
                height={44}
                className="w-[32px] h-[32px] lg:w-[44px] lg:h-[44px]"
              />
            )}
            <p className="text-[14px] lg:text-[18px] leading-[130%]">
              {item.text}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default SupportListBlock;

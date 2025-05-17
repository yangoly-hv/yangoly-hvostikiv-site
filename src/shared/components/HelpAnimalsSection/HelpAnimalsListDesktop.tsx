import Image from "next/image";
import * as motion from "motion/react-client";
import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";
import { IHelpAnimalsListItem } from "@/shared/types";
import ContactFormAction from "../ContactFormAction/ContactFormAction";
const HelpAnimalsListDesktop = ({ list }: { list: IHelpAnimalsListItem[] }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="hidden lg:grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5"
    >
      {list.map((item, index) => (
        <motion.div
          variants={listItemVariants}
          className="flex flex-col justify-between h-full rounded-[8px] border-[3px] border-[#EACCAA] py-6 px-[10px]"
          key={index}
        >
          <div>
            <div className="flex gap-4 justify-center">
              <Image
                src={item.titleIcon}
                alt={item.title}
                width={32}
                height={32}
              />
              <h3 className="text-[24px] font-arial leading-[130%]">
                {item.title}
              </h3>
            </div>
            <p className="text-[18px] text-center leading-[130%] font-bold mt-[25px]">
              {item.subtitle}
            </p>
            <ul className="mt-[18px] flex flex-col gap-4">
              {item.paragraphs.map((paragraph, index) => (
                <li className="flex gap-4 items-center" key={index}>
                  <Image
                    src={paragraph.icon}
                    alt={paragraph.text}
                    width={24}
                    height={24}
                  />
                  <p className="text-[14px] leading-[130%]">{paragraph.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto pt-6">
            <ContactFormAction buttonText={item.buttonText} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HelpAnimalsListDesktop;

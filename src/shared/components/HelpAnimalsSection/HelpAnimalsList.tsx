import Image from "next/image";
import * as motion from "motion/react-client";

import {
  containerVariants,
  listItemVariants,
} from "../Animations/animationVariants";
import type { IHelpAnimalsListItem } from "@/shared/types";
import ContactFormAction from "@/widgets/ContactFormAction/ContactFormAction";

const eventContactSources = [
  "event-partnership",
  "event-ambassador",
  "event-volunteering",
] as const;

const getEventContactSource = (index: number) => {
  const source = eventContactSources[index];
  if (!source) {
    throw new Error(`Missing contact source for charity event card ${index}`);
  }

  return source;
};

const HelpAnimalsList = ({ list }: { list: IHelpAnimalsListItem[] }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-10 lg:grid-cols-3"
  >
    {list.map((item, index) => (
      <motion.div
        key={index}
        variants={listItemVariants}
        className="flex h-full flex-col justify-between rounded-[8px] border-[3px] border-orange px-[7px] py-[21px] lg:px-[11px]"
      >
        <div>
          <div className="flex justify-center gap-4">
            <Image
              src={item.titleIcon}
              alt={item.title}
              width={44}
              height={44}
              className="h-8 w-8 lg:h-11 lg:w-11"
            />
            <h3 className="font-arial text-[24px] leading-[130%] lg:text-[32px]">
              {item.title}
            </h3>
          </div>
          <p className="mt-[30px] text-[18px] font-bold leading-[130%] lg:mt-[25px] lg:text-center">
            {item.subtitle}
          </p>
          <ul className="mt-[15px] flex flex-col gap-4 lg:mt-[18px] lg:gap-6">
            {item.paragraphs.map((paragraph, paragraphIndex) => (
              <li
                className="flex items-center gap-2 lg:gap-3"
                key={paragraphIndex}
              >
                <Image
                  src={paragraph.icon}
                  alt={paragraph.text}
                  width={44}
                  height={44}
                  className="h-6 w-6 shrink-0 lg:h-11 lg:w-11"
                />
                <p className="text-[14px] leading-[130%] lg:text-[18px]">
                  <span className="lg:hidden">{paragraph.textMob}</span>
                  <span className="hidden lg:inline">{paragraph.text}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto pt-[30px]">
          <ContactFormAction
            buttonText={item.buttonText}
            source={getEventContactSource(index)}
          />
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export default HelpAnimalsList;

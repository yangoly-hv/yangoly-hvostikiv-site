import * as motion from "motion/react-client";

import { IVolunteeringCardProps } from "@/shared/types";
import clsx from "clsx";
import Image from "next/image";

const VolunteeringCardDesk = ({
  index,
  item,
  className,
}: IVolunteeringCardProps) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.2,
        duration: 0.6,
        ease: "easeOut",
      }}
      viewport={{ once: true, amount: 0.2 }}
      style={{ backgroundColor: item.bg }}
      className={clsx(
        "py-[32px] rounded-[8px] relative flex flex-col overflow-hidden flex-grow",
        className
      )}
    >
      <div className="px-4 pl-[36px] z-[2]">
        <h3
          className={clsx(
            "font-arial text-[32px] tracking-[-0.225px] leading-[141%]",
            index === 0 && "w-full max-w-[420px] ",
            index === 1 && "w-full max-w-[561px] "
          )}
        >
          {item.title}
        </h3>
        <ul
          className={clsx(
            "grid grid-cols-1  gap-1 list-disc ml-[20px]",
            index === 0 && "max-w-[420px]",
            index === 3 && "w-full max-w-[393px]",
            index === 2 && "w-full max-w-[446px]",
            index === 1 && "w-full max-w-[363px]"
          )}
        >
          {item.paragraphs &&
            item.paragraphs.map((paragraph, index) => (
              <li
                className="p-[10px] text-[18px] leading-[114%] tracking-[-0.225px]"
                key={index}
              >
                {paragraph}
              </li>
            ))}
        </ul>
      </div>
      {item.imagePathDesk && (
        <div
          className={clsx(
            "absolute z-[1]",
            index === 0 &&
              "right-[-15px] bottom-0 w-[250px] h-[400px] laptop:w-[350px] laptop:h-[526px]",
            index === 3 &&
              "right-[-130px] bottom-[-35px] w-[448px] h-[363px] laptop:w-[548px] laptop:h-[536px] laptop:right-[-150px] laptop:bottom-[-90px]",
            index === 2 &&
              "right-[-25px] bottom-1 w-[283px] h-[336px] laptop:w-[243px] laptop:h-[456px] laptop:bottom-[-50px]",
            index === 1 &&
              "right-[-15px] bottom-[-15px] w-[285px] laptop:w-[307px] h-[246px] "
          )}
        >
          <Image
            src={item.imagePathDesk}
            alt="Volunteering Image"
            fill
            className="object-contain"
          />
        </div>
      )}
    </motion.li>
  );
};

export default VolunteeringCardDesk;

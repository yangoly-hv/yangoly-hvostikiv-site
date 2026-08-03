import * as motion from "motion/react-client";
import { IVolunteeringCardProps } from "@/shared/types";
import clsx from "clsx";
import Image from "next/image";

const VolunteeringCardMobile = ({
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
      className={clsx("pt-[32px] rounded-[8px] flex flex-col", className)}
    >
      <div className="px-4">
        <h3 className="mb-3 font-arial text-[24px] lg:text-[32px] tracking-[-0.225px] leading-[141%] whitespace-pre-line">
          {item.title}
        </h3>
        {item.text && (
          <p className="mb-4 text-[14px] lg:text-[18px] leading-[133%]">
            {item.text}
          </p>
        )}
        {item.listLabel && (
          <p className="mb-2 text-[14px] lg:text-[18px] leading-[133%] font-medium">
            {item.listLabel}
          </p>
        )}
        <ul className="grid grid-cols-1  gap-2 list-disc pl-5 ml-[18px]">
          {item.paragraphs &&
            item.paragraphs.map((paragraph, index) => (
              <li
                className="px-[10px] text-[14px] lg:text-[18px] leading-[114%] tracking-[-0.225px]"
                key={index}
              >
                {paragraph}
              </li>
            ))}
        </ul>
      </div>
      <div
        className={clsx(
          "relative w-full mx-auto mt-auto ",
          index === 0 && "w-full aspect-223/204",
          index === 1 && "aspect-330/264",
          index === 2 && "aspect-329/410",
          index === 3 && "aspect-448/299"
        )}
      >
        <Image
          src={item.imagePath}
          alt="Volunteering"
          fill
          className="object-bottom"
        />
      </div>
    </motion.li>
  );
};

export default VolunteeringCardMobile;

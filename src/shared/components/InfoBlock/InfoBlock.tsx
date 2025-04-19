import { IInfoBlockProps } from "@/shared/types";
import clsx from "clsx";
import * as motion from "motion/react-client";

const InfoBlock = ({
  translation,
  children,
  className = "",
  titleClassName = "",
  ...props
}: IInfoBlockProps) => {
  const { paragraphs, title } = translation;

  return (
    <div className={`mx-auto bg-white ${className}`} {...props}>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: "easeOut",
            },
          },
        }}
        className={clsx(
          "text-[20px] xl:text-left uppercase font-extrabold text-center font-arial xl:text-[32px] text-[#140A01] leading-[130%] mb-[28px]",
          titleClassName
        )}
      >
        {title}
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="space-y-6"
      >
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2 + index * 0.2,
                },
              },
            }}
            className="text-black text-[14px] md:text-[16px] xl:text-[18px] font-light leading-[130%]"
          >
            {paragraph.segments?.map((segment, segIndex) => (
              <span
                key={segIndex}
                className={segment.bold ? "font-normal" : "font-normal"}
              >
                {segment.text}
              </span>
            ))}
          </motion.p>
        ))}
      </motion.div>

      {children && <>{children}</>}
    </div>
  );
};

export default InfoBlock;

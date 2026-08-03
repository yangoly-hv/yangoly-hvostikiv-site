import type { ReactElement } from "react";
import { IInfoBlockProps } from "@/shared/types";
import clsx from "clsx";
import * as motion from "motion/react-client";

const InfoBlock = ({
  translation,
  blocks,
  children,
  className = "",
  titleClassName = "",
  ...props
}: IInfoBlockProps) => {
  const { title } = translation;
  const contentBlocks = blocks ?? [];
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
        className="space-y-5"
      >
        {(() => {
          const nodes: ReactElement[] = [];

          for (let i = 0; i < contentBlocks.length; i++) {
            const block = contentBlocks[i];
            if (!block) continue;

            // Group consecutive bullet list items into one <ul>
            if (block.listItem === "bullet") {
              const listItems: typeof contentBlocks = [];
              let j = i;

              while (j < contentBlocks.length) {
                const listItem = contentBlocks[j];
                if (!listItem || listItem.listItem !== "bullet") break;
                listItems.push(listItem);
                j++;
              }

              nodes.push(
                <motion.ul
                  key={block._key ?? `list-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.2 + i * 0.2,
                      },
                    },
                  }}
                  className="p-5 bg-orange-bright rounded-[20px] pl-6 space-y-[1lh]"
                >
                  {listItems.map((item) => (
                    <li
                      key={item._key}
                      className="text-[14px] md:text-[16px] xl:text-[18px] leading-[130%] text-black font-light"
                    >
                      {item.children?.map((child) => {
                        const isStrong = child.marks?.includes("strong");
                        return (
                          <span
                            key={child._key}
                            className={isStrong ? "font-arial" : "font-light"}
                          >
                            {child.text}
                          </span>
                        );
                      })}
                    </li>
                  ))}
                </motion.ul>
              );

              i = j - 1;
              continue;
            }

            const isHeading = block.style === "h3";
            const MotionTag = isHeading ? motion.h3 : motion.p;

            nodes.push(
              <MotionTag
                key={block._key ?? i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.2 + i * 0.2,
                    },
                  },
                }}
                className={clsx(
                  "text-[14px] md:text-[16px] xl:text-[18px] leading-[130%] whitespace-pre-line",
                  isHeading
                    ? "text-[20px] xl:text-left uppercase font-extrabold text-center font-arial xl:text-[32px] text-[#140A01] leading-[130%]"
                    : "font-light text-black"
                )}
              >
                {block.children?.map((child) => {
                  const isStrong = child.marks?.includes("strong");
                  return (
                    <span
                      key={child._key}
                      className={isStrong ? "font-arial" : "font-light"}
                    >
                      {child.text}
                    </span>
                  );
                })}
              </MotionTag>
            );
          }

          return nodes;
        })()}
      </motion.div>

      {children && <>{children}</>}
    </div>
  );
};

export default InfoBlock;

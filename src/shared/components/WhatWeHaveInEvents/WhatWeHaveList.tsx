import { IWhatWeHaveItem } from "@/shared/types";
import * as motion from "motion/react-client";
import Image from "next/image";

const WhatWeHaveList = ({ list }: { list: IWhatWeHaveItem[] }) => {
  return (
    <div>
      {/* до sm */}
      <div className="flex flex-col justify-center items-center">
        <ul className="grid grid-cols-1 gap-5 sm:hidden ">
          {list.map((item, index) => (
            <motion.li
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    delay: 0.1 * index,
                  },
                },
              }}
              className="w-full bg-white rounded-[8px] flex flex-col max-w-[420px]"
            >
              <div className="w-full aspect-[263/211] relative">
                <Image
                  src={item.imgPath}
                  alt={item.title}
                  fill
                  className="object-cover rounded-t-[8px]"
                />
              </div>
              <div className="px-4 py-4 flex flex-col">
                <h3 className="font-arial text-[18px] leading-[130%] text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-[12px] leading-[120%] text-center">
                  {item.text}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
      {/* sm та більше */}
      <ul className="hidden sm:grid grid-cols-1 gap-5">
        {list.map((item, index) => (
          <motion.li
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.1 * index,
                },
              },
            }}
            className="w-full h-full bg-white rounded-[8px] flex"
          >
            {index % 2 === 0 ? (
              <>
                <div className="aspect-[464/382] h-auto sm:w-[39%] relative">
                  <Image
                    src={item.imgPath}
                    alt={item.title}
                    fill
                    className="object-cover rounded-l-[8px]"
                  />
                </div>
                <div className="px-6 py-4 sm:w-[61%] flex flex-col justify-center items-center relative">
                  <Image
                    src={item.bgPath}
                    width={70}
                    height={70}
                    alt="Funny item"
                    className="absolute top-[20px] right-[55px]"
                  />
                  <Image
                    src={item.bgPath}
                    width={70}
                    height={70}
                    alt="Funny item"
                    className="absolute bottom-[20px] left-[55px] rotate-[30deg]"
                  />
                  <h3 className="font-arial text-[18px] lg:text-[40px] leading-[130%] text-center mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[12px] lg:text-[20px] leading-[120%] text-center">
                    {item.text}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="px-6 py-4 sm:w-[61%] flex flex-col justify-center items-center relative">
                  <Image
                    src={item.bgPath}
                    width={70}
                    height={70}
                    alt="Funny item"
                    className="absolute top-[20px] left-[55px]"
                  />
                  <Image
                    src={item.bgPath}
                    width={70}
                    height={70}
                    alt="Funny item"
                    className="absolute bottom-[20px] right-[55px] rotate-[30deg]"
                  />
                  <h3 className="font-arial text-[18px] lg:text-[40px] leading-[130%] text-center mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[12px] lg:text-[20px] leading-[120%] text-center">
                    {item.text}
                  </p>
                </div>
                <div className="aspect-[464/382] h-auto sm:w-[39%] relative">
                  <Image
                    src={item.imgPath}
                    alt={item.title}
                    fill
                    className="object-cover rounded-r-[8px]"
                  />
                </div>
              </>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default WhatWeHaveList;

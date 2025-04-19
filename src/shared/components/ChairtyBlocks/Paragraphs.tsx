import clsx from "clsx";
import * as motion from "motion/react-client";

const Paragraphs = ({ paragraphs }: { paragraphs: string[] }) => {
  return (
    <div className="container flex justify-center mx-auto px-4 xl:px-[40px]">
      <div className="grid mt-[48px] pb-[100px] xl:pb-[148px] grid-cols-1 md:grid-cols-2 xl:flex xl:gap-[80px] gap-[32px]">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
            className={clsx(
              "text-[18px] text-black leading-[130%] font-light",
              index === 0 && "xl:max-w-[235px] laptop:max-w-full",
              index === 1 && "xl:max-w-[265px] laptop:max-w-full",
              index === 2 && "xl:max-w-[326px] laptop:max-w-full",
              index === 3 && "xl:max-w-[346px] laptop:max-w-full"
            )}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default Paragraphs;

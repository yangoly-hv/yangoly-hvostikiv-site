import clsx from "clsx";
import * as motion from "motion/react-client";

interface ParagraphsProps {
  paragraphs: string[];
  mobTitle: string;
  deskTitle: string;
}

const Paragraphs = ({ paragraphs, mobTitle, deskTitle }: ParagraphsProps) => {
  return (
    <div className="container flex flex-col justify-center items-center mx-auto px-4 xl:px-[40px]">
      <div className="grid mt-[48px] pb-[100px] xl:pb-[148px] grid-cols-1 lg:grid-cols-3  xl:flex xl:gap-[87px] gap-[32px]">
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
              index === 0 && "lg:max-w-[235px]",
              index === 1 && "lg:max-w-[265px]",
              index === 2 && "lg:max-w-[326px]"
            )}
            dangerouslySetInnerHTML={{ __html: paragraph }}
          />
        ))}
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="lg:hidden block text-center font-arial  text-[24px]  leading-[130%] "
      >
        {mobTitle}
      </motion.h2>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="hidden lg:block max-w-[1039px] text-center font-arial  text-[32px]  leading-[130%] "
      >
        {deskTitle}
      </motion.h2>
    </div>
  );
};

export default Paragraphs;

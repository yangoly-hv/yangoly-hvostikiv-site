import clsx from "clsx";
import * as motion from "motion/react-client";
import Image from "next/image";

interface ParagraphsProps {
  title: string;
  paragraphs: string[];
  mobTitle: string;
  deskTitle: string;
}

const Paragraphs = ({ title, paragraphs, mobTitle, deskTitle }: ParagraphsProps) => {
  return (
    <section className="pt-[120px] xl:pt-[56px]">
      <div className="container mx-auto px-4 xl:px-[40px] max-w-[1432px] flex flex-col items-center gap-[20px] md:grid md:grid-cols-[minmax(0,698px)_minmax(0,734px)] md:items-stretch md:gap-0">
        <div className="relative w-full h-auto aspect-[328/232] max-w-[698px] md:aspect-auto md:min-h-[320px] min-w-[328px] md:w-full md:min-w-0">
          <Image src="/images/events/parag-image.webp"
            alt="Paragraphs BG"
            fill
            className="object-cover rounded-[8px]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="w-full min-w-0 bg-white rounded-[8px] px-[24px] pt-[40px] pb-[20px] lg:px-[93px] lg:py-[90px]">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut", delay: 0.4 },
              },
            }}
            className="text-dark text-[24px] lg:text-[32px] leading-[130%] font-black uppercase font-arial text-center mb-[24px] lg:mb-[48px]"
          >
            {title}
          </motion.h2>
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
                "text-[18px] text-black leading-[130%] font-light mb-[24px]",
              )}
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="lg:hidden block md:text-left text-center font-arial  text-[24px]  leading-[130%] "
          >
            {mobTitle}
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="hidden lg:block max-w-[1039px] mx-auto text-center font-arial  text-[28px]  leading-[130%] "
          >
            {deskTitle}
          </motion.h2>
        </div>
      </div>
    </section>
  );
};

export default Paragraphs;

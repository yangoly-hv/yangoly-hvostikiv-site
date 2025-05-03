import * as motion from "motion/react-client";
import Image from "next/image";
import { IPartnersProps } from "@/shared/types";
import { getTranslations } from "next-intl/server";

const partners = [
  {
    src: "/images/partners/pesiki-fest.png",
    alt: "Pesiki Fest Logo",
    width: 70,
  },
  { src: "/images/partners/artzavod.png", alt: "Artzavod Logo", width: 130 },
  { src: "/images/partners/habiohika.png", alt: "Habiohika Logo", width: 527 },
  { src: "/images/partners/practik.png", alt: "Practik Logo", width: 48 },
  { src: "/images/partners/brit.png", alt: "Brit Logo", width: 180 },
];

const Partners = async ({ withTitle = true, ...props }: IPartnersProps) => {
  const t = await getTranslations("Partners");

  return (
    <section {...props}>
      {withTitle && (
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.2 },
            },
          }}
          className="text-[24px] xl:text-[32px] text-dark font-arial font-black uppercase leading-[130%] text-center mb-8"
        >
          {t("title")}
        </motion.h2>
      )}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.4 },
          },
        }}
        className="relative flex overflow-x-hidden overflow-y-hidden w-full h-[60px]"
      >
        <div className="flex space-x-[100px] animate-marquee">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center shrink-0"
              style={{ width: `${partner.width}px` }}
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={32}
                className="object-contain h-full w-auto"
                priority={index < 5}
              />
            </div>
          ))}
          {partners.map((partner, index) => (
            <div
              key={`duplicate-${index}`}
              className="flex items-center shrink-0"
              style={{ width: `${partner.width}px` }}
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={32}
                className="object-contain h-full w-auto"
                priority={false}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-0 flex space-x-[100px] animate-marquee2">
          {partners.map((partner, index) => (
            <div
              key={`second-${index}`}
              className="flex items-center shrink-0"
              style={{ width: `${partner.width}px` }}
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={32}
                className="object-contain h-full w-auto"
                priority={false}
              />
            </div>
          ))}
          {partners.map((partner, index) => (
            <div
              key={`second-duplicate-${index}`}
              className="flex items-center shrink-0"
              style={{ width: `${partner.width}px` }}
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={32}
                className="object-contain h-full w-auto"
                priority={false}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Partners;

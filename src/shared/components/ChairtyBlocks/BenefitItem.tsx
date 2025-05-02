import * as motion from "motion/react-client";
import Image from "next/image";

interface BenefitItemProps {
  text: string;
  index: number;
}

const BenefitItem = ({ text, index }: BenefitItemProps) => (
  <motion.li
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut",
          delay: 0.6 + index * 0.2,
        },
      },
    }}
    className="flex gap-4"
  >
    <Image
      src="/images/paw.marker-mob.png"
      alt="Paw"
      width={32}
      height={32}
      className="w-8 h-8"
    />
    <p className="text-[18px] text-white leading-[130%]">{text}</p>
  </motion.li>
);

export default BenefitItem;

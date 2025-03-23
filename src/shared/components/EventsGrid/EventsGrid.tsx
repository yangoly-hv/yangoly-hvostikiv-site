import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, slideUp, generalSlideUp } from "@/shared/utils";

const EventsGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="hidden xl:block">
      <div className="grid grid-cols-[2.92fr_2.82fr_5.92fr] gap-5">
        {/* Перший стовпчик */}
        <div className="flex flex-col gap-5">
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
          >
            <Image
              src={images[0]}
              alt="Event 1"
              layout="responsive"
              width={349}
              height={228}
              className="rounded-[8px] object-cover"
            />
          </motion.div>
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.4}
          >
            <Image
              src={images[1]}
              alt="Event 2"
              layout="responsive"
              width={349}
              height={236}
              className="rounded-[8px] object-cover"
            />
          </motion.div>
        </div>

        {/* Другий стовпчик */}
        <div className="flex flex-col gap-5">
          <motion.div
            variants={generalSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.6}
          >
            <Image
              src={images[2]}
              alt="Event 3"
              layout="responsive"
              width={337}
              height={317}
              className="rounded-[8px]"
            />
          </motion.div>
          <motion.div
            variants={generalSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.8}
          >
            <Image
              src={images[3]}
              alt=""
              layout="responsive"
              width={337}
              height={147}
              className="rounded-[8px] object-cover"
            />
          </motion.div>
        </div>

        {/* Третій стовпчик */}
        <div className="flex">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1.0}
          >
            <Image
              src={images[4]}
              alt="Event 4"
              layout="responsive"
              width={706}
              height={484}
              className="rounded-[8px] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventsGrid;

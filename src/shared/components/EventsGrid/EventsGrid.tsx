import Image from "next/image";
import * as motion from "motion/react-client";

const EventsGrid = ({ images }: { images: string[] }) => {
  return (
    <div className="hidden xl:block">
      <div className="grid grid-cols-[2.92fr_2.82fr_5.92fr] gap-5">
        {/* Перший стовпчик */}
        <div className="flex flex-col gap-5">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.4 },
              },
            }}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.6 },
              },
            }}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, delay: 0.8 },
              },
            }}
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { duration: 0.8, delay: 1.0 },
              },
            }}
            className="relative w-full h-full "
          >
            <Image
              src={images[4]}
              alt="Event 4"
              fill
              className="rounded-[8px] object-cover"
              sizes="(min-width: 1280px) 706px, 100vw"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventsGrid;

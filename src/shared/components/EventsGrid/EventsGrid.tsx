import Image from "next/image";
import * as motion from "motion/react-client";

const EventsGrid = ({ images }: { images: string[] }) => {
  const [first, second, third, fourth, fifth] = images;
  if (!first || !second || !third || !fourth || !fifth) return null;
  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-[2.92fr_2.82fr_5.92fr] gap-5 max-h-[484px]">
        {/* Перший стовпчик: 228px + 236px + gap */}
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
            className="relative h-[228px] shrink-0 overflow-hidden rounded-[8px]"
          >
            <Image
              src={first}
              alt="Event 1"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 349px, 100vw"
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
            className="relative h-[236px] shrink-0 overflow-hidden rounded-[8px]"
          >
            <Image
              src={second}
              alt="Event 2"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 349px, 100vw"
            />
          </motion.div>
        </div>

        {/* Другий стовпчик: 317px + 147px + gap */}
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
            className="relative h-[317px] shrink-0 overflow-hidden rounded-[8px]"
          >
            <Image
              src={third}
              alt="Event 3"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 337px, 100vw"
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
            className="relative h-[147px] shrink-0 overflow-hidden rounded-[8px]"
          >
            <Image
              src={fourth}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 337px, 100vw"
            />
          </motion.div>
        </div>

        {/* Третій стовпчик: full height 484px */}
        <div className="flex min-h-0">
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
            className="relative h-full min-h-[484px] w-full overflow-hidden rounded-[8px]"
          >
            <Image
              src={fifth}
              alt="Event 4"
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 706px, 100vw"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EventsGrid;

import EventsGrid from "@/shared/components/EventsGrid/EventsGrid";
import EventsSlider from "@/shared/components/EventsSlider/EventsSlider";
import * as motion from "motion/react-client";

// const heroImages = [
//   "/images/events/hero/img1.webp",
//   "/images/events/hero/img3.webp",
//   "/images/events/hero/img2.webp",
//   "/images/events/hero/img4.webp",
//   "/images/events/hero/img5.webp",
// ];
const Hero = ({ images, title }: { title: string, images: string[] }) => {
  return (
    <div className="container mx-auto px-4 xl:px-[40px] pt-[60px]">
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
        className="lg:hidden"
      >
        <EventsSlider images={images} />
      </motion.div>
      <EventsGrid images={images} />

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
        className="text-dark text-[24px] lg:text-[32px] leading-[130%] font-black uppercase font-arial text-center mt-[80px]"
      >
        {title}
      </motion.h2>
    </div>
  );
};

export default Hero;

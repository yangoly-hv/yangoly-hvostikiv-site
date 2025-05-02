import EventsGrid from "@/shared/components/EventsGrid/EventsGrid";
import EventsSlider from "@/shared/components/EventsSlider/EventsSlider";
import * as motion from "motion/react-client";

const images = [
  "/images/partners1.jpg",
  "/images/partners2.jpg",
  "/images/partners3.jpg",
  "/images/partners4.jpg",
  "/images/events/last-slide.jpg",
];

// Фото для геро секції
const heroImages = [
  "/images/events/hero/img1.jpg",
  "/images/events/hero/img3.jpg",
  "/images/events/hero/img2.jpg",
  "/images/events/hero/img4.jpg",
  "/images/events/hero/img5.jpg",
];
const Hero = ({ title }: { title: string }) => {
  return (
    <div className="container mx-auto px-4 xl:px-[40px] pt-[60px]">
      <div className="xl:hidden">
        <EventsSlider images={images} />
      </div>
      <EventsGrid images={heroImages} />

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
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

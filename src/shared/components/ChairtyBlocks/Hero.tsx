import EventsGrid from "@/shared/components/EventsGrid/EventsGrid";
import EventsSlider from "@/shared/components/EventsSlider/EventsSlider";
import * as motion from "motion/react-client";
const Hero = ({ images, title }: { title: string, images: string[] }) => {
  return (
    <section className="container mx-auto px-4 xl:px-[40px] pt-[60px] xl:pt-[100px]">
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

      <h1 className="sr-only">{title}</h1>
    </section>
  );
};

export default Hero;

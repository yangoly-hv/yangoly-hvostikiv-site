import Image from "next/image";
import * as motion from "motion/react-client";

interface IMissionProps {
    missionTitle: string;
    missionParagraph: string;
}

const Mission = ({ missionTitle, missionParagraph }: IMissionProps) => {
    return (
        <section className="relative pt-[100px] md:pt-[120px] xl:pt-[142px]">

            {/* Mobile */}
            <motion.div
                className="absolute top-[110px] left-1/2 -translate-x-1/2  w-[488px] aspect-[502/349] md:hidden"
                initial={{opacity: 0, scale: 0.85, x: "-50%"}}
                whileInView={{opacity: 1, scale: 1, x: "-50%"}}
                transition={{duration: 0.8, ease: "easeOut"}}
                viewport={{once: true, amount: 0.2}}
            >
                {/* Background */}
                <Image
                    src="/images/events/mission-bg-mob.png"
                    alt="Mission BG"
                    fill
                    className="object-cover"
                    priority
                />

                {/* Pets */}
                <motion.div
                    className="absolute right-[30px] inset-0 z-10"
                    initial={{y: 20, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    transition={{duration: 0.8, delay: 0.3}}
                    viewport={{once: true}}
                >
                    <Image
                        src="/images/events/pets.png"
                        alt="Pets"
                        fill
                        className="object-contain object-bottom pl-4"
                        priority
                    />
                </motion.div>
            </motion.div>

            <motion.div
                className="hidden md:block absolute top-[132px] aspect-[1607/724] right-[-540px] w-full"
                initial={{opacity: 0, scale: 0.85}}
                whileInView={{opacity: 1, scale: 1}}
                transition={{duration: 0.8, ease: "easeOut"}}
                viewport={{once: true, amount: 0.2}}
            >

                {/* Background */}
                <Image
                    src="/images/events/mission-bg-desk.png"
                    alt="Mission BG"
                    fill
                    className=""
                    priority
                />
                {/* Pets */}
                <motion.div
                    className="absolute inset-0 z-10 right-[335px]"
                    initial={{y: 30, opacity: 0}}
                    whileInView={{y: 0, opacity: 1}}
                    transition={{duration: 0.8, delay: 0.4}}
                    viewport={{once: true}}
                >
                    <Image
                        src="/images/events/pets.png"
                        alt="Pets"
                        fill
                        className="object-contain object-bottom"
                        priority
                    />
                </motion.div>
            </motion.div>

                <div
                    className="
          container
          mx-auto
          grid
          grid-cols-1
          items-center
          gap-10
          px-4
          xl:px-[40px]
          lg:grid-cols-[1.6fr_3fr]
          mb-[260px]
        "
                >
                    {/* LEFT — TEXT */}
                    <div className="max-w-[400px] lg:max-w-none">
                        {/* Заголовок */}
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true, amount: 0.3}}
                            variants={{
                                hidden: {opacity: 0, y: 30},
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {duration: 0.6, ease: "easeOut"},
                                },
                            }}
                            className="
              text-[#EACCAA]
              text-[24px]
              font-black
              uppercase
              leading-[130%]
              md:text-[40px]
              lg:text-[64px]
            "
                        >
                            {missionTitle}
                        </motion.h2>

                        {/* Параграф */}
                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true, amount: 0.3}}
                            variants={{
                                hidden: {opacity: 0, y: 30},
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {duration: 0.6, ease: "easeOut", delay: 0.2},
                                },
                            }}
                            className="
              mt-4
              text-black
              text-[14px]
              leading-[130%]
              md:text-[18px]
              lg:text-[32px]
            "
                        >
                            {missionParagraph}
                        </motion.p>
                    </div>

                    {/* RIGHT — IMAGES */}
                </div>
        </section>
);
};

export default Mission;

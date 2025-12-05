// import Image from "next/image";
// import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
// import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import AboutUs from "./AboutUs/AboutUs";
import AboutOwner from "./AboutOwner/AboutOwner";
import { getTranslations } from "next-intl/server";

import client from "@/shared/lib/sanity";
import {aboutFoundationQuery, aboutFoundersQuery} from "@/shared/lib/queries";

const About = async ({lang}: {lang: string}) => {
  const t = await getTranslations("About");
  const aboutUs = await t.raw("aboutUs");
  const aboutOwner = await t.raw("aboutOwner");

  const about = await client.fetch(aboutFoundationQuery, {
      lang,
  });

    const founders = await client.fetch(aboutFoundersQuery, {
        lang,
    });

  return (
    <section id="about" className="mb-[100px]">
      <div className="container px-4 xl:px-10 mx-auto ">
        {/*<AnimatedWrapper*/}
        {/*  animation={fadeInAnimation({ y: 30 })}*/}
        {/*  className="relative w-full  h-[400px] lg:h-[600px] xl:h-[806px] desk:h-[1000px] mb-[100px] xl:mb-[111px] rounded-[20px] overflow-hidden"*/}
        {/*>*/}
        {/*  <Image*/}
        {/*    src="/images/about/about-main.webp"*/}
        {/*    alt="charity event"*/}
        {/*    fill*/}
        {/*    sizes="100%vw"*/}
        {/*    className="object-cover object-[center_22%]"*/}
        {/*  />*/}
        {/*</AnimatedWrapper>*/}
        {/*  @ts-expect-error */}
        <AboutUs about={about} translation={aboutUs} />
        {/*  @ts-expect-error*/}
        <AboutOwner founders={founders} translation={aboutOwner} />
      </div>
    </section>
  );
};

export default About;

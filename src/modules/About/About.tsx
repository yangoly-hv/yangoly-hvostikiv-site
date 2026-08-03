import AboutUs from "./AboutUs/AboutUs";
import { getTranslations } from "next-intl/server";
import { getAboutFoundation } from "@/features/home/server/data";
import type { AppLocale } from "@/shared/config/site";

const About = async ({lang}: {lang: AppLocale}) => {
  const t = await getTranslations("About");
  const aboutUs = await t.raw("aboutUs");
  const about = await getAboutFoundation(lang);

  if (!about) return null;

  return (
    <section id="about" className="mb-[100px]">
      <div className="container px-4 xl:px-10 mx-auto ">
        <AboutUs about={about} translation={aboutUs} />
      </div>
    </section>
  );
};

export default About;

import * as motion from "motion/react-client";
import Logo from "@/shared/components/Logo/Logo";
import SocialsList from "@/shared/components/SocialsList/SocialsList";
import { INavigationItem } from "@/shared/types";
import Link from "next/link";

const Footer = ({ translation }: { translation: INavigationItem[] }) => {
  return (
    <footer className="bg-[#001808] py-10 px-4 flex flex-col items-center gap-6 xl:gap-8 xl:items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
        }}
      >
        <Logo href={"/"} className="w-[109px] h-[48px]" />
      </motion.div>

      <motion.nav
        className="flex flex-col items-center gap-4 mt-[56px] xl:mt-2 xl:flex-row"
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
        {translation.map((item, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.4 + index * 0.1 },
              },
            }}
          >
            <Link
              className="text-white text-[18px] leading-[120%] hover:text-primary-gray/95 transition-base"
              href={item.href}
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
      </motion.nav>

      <motion.div
        className="flex justify-start"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: 0.6,
              delay: 0.6 + translation.length * 0.1,
            },
          },
        }}
      >
        <SocialsList iconClass="text-white" />
      </motion.div>
    </footer>
  );
};

export default Footer;

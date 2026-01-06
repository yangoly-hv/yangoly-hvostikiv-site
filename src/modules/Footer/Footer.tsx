import * as motion from "motion/react-client";
import Logo from "@/shared/components/Logo/Logo";
import SocialsList from "@/shared/components/SocialsList/SocialsList";
import { IContacts, INavigationItem } from "@/shared/types";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  containerVariants,
  listItemVariants,
} from "@/shared/components/Animations/animationVariants";
import { EmailIcon, PhoneIcon } from "../../../public/images/icons";
import { LocationIcon } from "../../../public/images/icons/LocationIcon";

const Footer = async () => {
  const t = await getTranslations("Footer");
  const navigation = (await t.raw("navigation")) as INavigationItem[];
  const contacts = (await t.raw("contacts")) as IContacts;
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
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {navigation.map((item, index) => (
          <motion.div key={index} variants={listItemVariants}>
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
              delay: 0.6 + navigation.length * 0.2,
            },
          },
        }}
      >
        <SocialsList iconClass="text-white" />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="flex flex-col gap-4 justify-center items-center xl:flex-row"
      >
        <motion.a
          variants={listItemVariants}
          href="tel:+380972002400"
          className="flex items-center gap-2 text-[14px] font-medium text-white"
        >
          <PhoneIcon /> {contacts.phone}
        </motion.a>
        <motion.a
          variants={listItemVariants}
          href="mailto:email@gmail.com"
          className="flex items-center gap-2 text-[14px] font-medium text-white"
        >
          <EmailIcon /> {contacts.email}
        </motion.a>
        <motion.div
          variants={listItemVariants}
          className="flex items-center gap-2 text-[14px] font-medium text-white"
        >
          <LocationIcon /> {contacts.address}
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;

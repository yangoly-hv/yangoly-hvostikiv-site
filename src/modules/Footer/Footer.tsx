import * as motion from "motion/react-client";
import Logo from "@/shared/components/Logo/Logo";
import SocialsList from "@/shared/components/SocialsList/SocialsList";
import { IContacts, INavigationItem } from "@/shared/types";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  containerVariants,
  listItemVariants,
} from "@/shared/components/Animations/animationVariants";
import {
  CodeSiteTagIcon,
  EmailIcon,
  PhoneIcon,
} from "../../../public/images/icons";
import { LocationIcon } from "../../../public/images/icons/LocationIcon";
import { getSocialLinks } from "@/features/site/server/data";
import type { SocialLink } from "@/shared/lib/socialLinks";
import MetaTrackedLink from "@/shared/components/MetaTrackedLink/MetaTrackedLink";

type FooterProps = {
  socials?: SocialLink[];
};

const Footer = async ({ socials }: FooterProps) => {
  const t = await getTranslations("Footer");
  const navigation = (await t.raw("navigation")) as INavigationItem[];
  const contacts = (await t.raw("contacts")) as IContacts;
  const socialLinks = socials ?? (await getSocialLinks());
  return (
    <footer className="bg-orange-bg py-10 px-4 flex flex-col items-center gap-6 xl:gap-8 xl:items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
        }}
      >
        <Logo href={"/"} className="w-[109px] h-[48px]" variant="color" alt={t("logoAlt")} />
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
              className="text-dark text-[18px] leading-[120%] hover:text-primary-gray/95 transition-base"
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
        <SocialsList links={socialLinks} iconClass="text-dark" />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        className="flex flex-col gap-4 justify-center items-center xl:flex-row"
      >
        <motion.div variants={listItemVariants}>
          <MetaTrackedLink
            href="tel:+380972002400"
            event="Contact"
            className="flex items-center gap-2 text-[14px] font-medium text-dark"
          >
            <PhoneIcon /> {contacts.phone}
          </MetaTrackedLink>
        </motion.div>
        <motion.div variants={listItemVariants}>
          <MetaTrackedLink
            href={`mailto:${contacts.email}`}
            event="Contact"
            className="flex items-center gap-2 text-[14px] font-medium text-dark"
          >
            <EmailIcon /> {contacts.email}
          </MetaTrackedLink>
        </motion.div>
        <motion.div
          variants={listItemVariants}
          className="flex items-center gap-2 text-[14px] font-medium text-dark"
        >
          <LocationIcon /> {contacts.address}
        </motion.div>
      </motion.div>
      <motion.div
        className="flex flex-col items-center gap-1"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6, delay: 0.3 } },
        }}
      >
        <p className="text-[8px] font-medium uppercase leading-[120%] text-dark/60">
          {t("createdBy")}
        </p>
        <a
          href="https://www.code-site.art"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex items-center gap-2 font-arial text-[13px] leading-[120%] text-dark transition-colors duration-300 hover:text-green"
        >
          CODE-SITE.ART <CodeSiteTagIcon className="mb-1" width={18} height={17} />
        </a>
      </motion.div>
    </footer>
  );
};

export default Footer;

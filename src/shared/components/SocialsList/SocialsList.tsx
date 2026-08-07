import Link from "next/link";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  TelegramIcon,
  YoutubeIcon,
} from "../../../../public/images/icons";
import type { ComponentType } from "react";
import type { SocialLink, SocialNetwork } from "@/shared/lib/socialLinks";
import type { ISvgIconProps } from "@/shared/types";

const socialIcons: Record<SocialNetwork, ComponentType<ISvgIconProps>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  telegram: TelegramIcon,
  youtube: YoutubeIcon,
};

const socialNames: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter",
  telegram: "Telegram",
  youtube: "Youtube",
};

type SocialsListProps = {
  links: SocialLink[];
  iconClass?: string;
};

const SocialsList = ({ links, iconClass = "text-orange" }: SocialsListProps) => {
  if (links.length === 0) return null;

  return (
    <ul className="flex items-center justify-center gap-4">
      {links.map((item) => {
        const Icon = socialIcons[item.network];
        return (
          <li key={item.network}>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={item.href}
              aria-label={socialNames[item.network]}
              className="flex items-center transition-all duration-300 hover:scale-110 relative group"
            >
              <span className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Icon
                className={`${iconClass} relative transition-transform duration-300`}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SocialsList;

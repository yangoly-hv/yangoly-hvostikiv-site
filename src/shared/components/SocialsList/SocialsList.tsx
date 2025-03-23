import Link from "next/link";
import {
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  TelegramIcon,
  YoutubeIcon,
} from "../../../../public/images/icons";

const socials = [
  {
    icon: InstagramIcon,
    href: "/",
    name: "Instagram",
  },
  {
    icon: TwitterIcon,
    href: "/",
    name: "Twitter",
  },
  {
    icon: FacebookIcon,
    href: "/",
    name: "Facebook",
  },
  {
    icon: TelegramIcon,
    href: "/",
    name: "Telegram",
  },
  {
    icon: YoutubeIcon,
    href: "/",
    name: "Youtube",
  },
];

const SocialsList = ({ iconClass = "text-orange" }: { iconClass?: string }) => {
  return (
    <ul className="flex items-center justify-center gap-4">
      {socials.map((item) => (
        <li key={item.name}>
          <Link
            target="_blank"
            href={item.href}
            className="flex items-center transition-all duration-300 hover:scale-110 relative group"
          >
            <span className="absolute -inset-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <item.icon
              className={`${iconClass} relative transition-transform duration-300`}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SocialsList;

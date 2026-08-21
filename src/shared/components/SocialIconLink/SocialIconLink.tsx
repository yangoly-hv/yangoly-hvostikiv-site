import type { ReactNode } from "react";
import { getSafeHref } from "@/shared/lib/safeHref";

type SocialIconLinkProps = {
  href?: string | null;
  label: string;
  children: ReactNode;
};

const SocialIconLink = ({ href, label, children }: SocialIconLinkProps) => {
  const safeHref = getSafeHref(href);
  if (!safeHref) return null;

  return (
    <a
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={label}
      className="text-dark/45 hover:text-dark transition-colors duration-300"
    >
      {children}
    </a>
  );
};

export default SocialIconLink;

import { ILogoProps } from "@/shared/types";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";
import SafeImage from "@/shared/components/SafeImage/SafeImage";

const Logo = ({ variant = "black", className = "", alt, ...props }: ILogoProps) => {
    return (
        <Link {...props} className={`${className} relative block overflow-hidden`}>
            <SafeImage
                src="/images/logo.webp"
                alt={alt ?? ""}
                priority
                fill
                sizes="10vw"
                className={clsx(
                    variant === "black" ? "logo-white-mask" : "",
                    "w-full h-full object-cover"
                )}
            />
        </Link>
    );
};

export default Logo;

"use client";
import { ILogoProps } from "@/shared/types";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ variant = "black", className = "", ...props }: ILogoProps) => {
    return (
        <Link {...props} className={`${className} relative block overflow-hidden`}>
            <Image
                src="/images/logo.webp"
                alt="logo"
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

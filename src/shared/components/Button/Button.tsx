import type { MouseEventHandler } from "react";
import { cn } from "@/shared/utils";
import { IButtonProps } from "@/shared/types";
import { getSafeHref } from "@/shared/lib/safeHref";

const Button = ({
  text,
  variant = "primary",
  fullWidth = false,
  className,
  href,
  type,
  onClick,
  ...props
}: IButtonProps) => {
  const baseStyles =
    "uppercase py-3 px-6 rounded-[28px] transition-all duration-300 ease-in-out text-[14px] xl:text-[18px] leading-[110%] font-bold";

  const variantStyles = {
    primary: "text-white bg-green hover:brightness-125 active:scale-95",
    secondary: "text-white bg-orange hover:bg-orange/90  active:scale-95",
    orange:
      "text-dark bg-orange-bright hover:bg-orange-bright/90  active:scale-95",
    outline:
      "border border-green text-green hover:bg-green hover:text-white  active:scale-95",
  };
  const widthStyle = fullWidth ? "w-full" : "w-auto";
  const classes = cn(baseStyles, variantStyles[variant], widthStyle, className);

  if (href) {
    const safeHref = getSafeHref(href);
    if (!safeHref) return null;

    return (
      <a
        href={safeHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(classes, "inline-flex items-center justify-center text-center")}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {text}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {text}
    </button>
  );
};

export default Button;

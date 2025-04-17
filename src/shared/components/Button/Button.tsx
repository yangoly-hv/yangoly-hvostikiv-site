import { cn } from "@/shared/utils";
import { IButtonProps } from "@/shared/types";

const Button = ({
  text,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: IButtonProps) => {
  const baseStyles =
    "uppercase py-3 px-6 rounded-[28px] transition-all duration-300 ease-in-out text-[14px] xl:text-[18px] leading-[110%] font-bold";

  const variantStyles = {
    primary: "text-white bg-green hover:bg-green/90  active:scale-95",
    secondary: "text-white bg-orange hover:bg-orange/90  active:scale-95",
    orange:
      "text-dark bg-orange-bright hover:bg-orange-bright/90  active:scale-95",
    outline:
      "border border-green text-green hover:bg-green hover:text-white  active:scale-95",
  };
  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], widthStyle, className)}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;

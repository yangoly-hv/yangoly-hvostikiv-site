import { cn } from "@/shared/utils";
import Image from "next/image";

const JarWithPaw = ({
  variant = "big",
}: {
  variant?: "big" | "small" | "middle";
}) => {
  return (
    <div className="relative">
      <Image
        src="/images/money.mobile.png"
        alt="money"
        width={variant === "big" ? 186 : variant === "middle" ? 129 : 54}
        height={variant === "big" ? 282 : variant === "middle" ? 195 : 82}
        className="relative z-30"
      />
      <Image
        src="/images/paw.mobile.png"
        alt="paw"
        width={variant === "big" ? 74 : variant === "middle" ? 51 : 21}
        height={variant === "big" ? 72 : variant === "middle" ? 50 : 21}
        className={cn(
          "absolute right-5 -top-3 z-20",
          variant === "small" && "right-1 -top-1",
          variant === "middle" && "right-3 -top-2"
        )}
      />
    </div>
  );
};

export default JarWithPaw;

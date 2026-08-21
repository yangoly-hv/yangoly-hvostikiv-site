import type { PropsWithChildren } from "react";
import { cn } from "@/shared/utils";

type LiquidGlassProps = PropsWithChildren<{
  className?: string;
  /** Keep in sync with the wrapper radius so the glass layers follow it. */
  radiusClassName?: string;
}>;

/**
 * Frosted "liquid glass" panel: translucent gradient fill, backdrop blur and a
 * 1px gradient border, matching the floating header pill.
 */
const LiquidGlass = ({
  className,
  radiusClassName = "rounded-[24px]",
  children,
}: LiquidGlassProps) => (
  <div className={cn("relative", radiusClassName, className)}>
    <div
      className={cn(
        "absolute inset-0 -z-10 bg-[linear-gradient(90.95deg,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.82)_100%)] shadow-[inset_0px_4px_12.6px_0px_rgba(255,255,255,0.25)] backdrop-blur-[10px]",
        radiusClassName
      )}
      aria-hidden
    />
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10", radiusClassName)}
      style={{
        background: "linear-gradient(270.67deg, #FFFFFF -9.58%, #D4D4D4 103.45%)",
        padding: "1px",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
      aria-hidden
    />
    {children}
  </div>
);

export default LiquidGlass;

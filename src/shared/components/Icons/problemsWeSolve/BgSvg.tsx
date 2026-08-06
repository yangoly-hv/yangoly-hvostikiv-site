import { ISvgIconProps } from "@/shared/types";

export const ProblemsWeSolveBgSvg = ({
  className,
  ...props
}: ISvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 152"
      fill="none"
      preserveAspectRatio="none"
      className={className}
      {...props}
    >
      <path
        d="M362 9.94625C362 2.32431 352.271 -1.05917 347.467 4.85847C211.494 172.362 140.07 144.932 14.1714 2.74485C9.25812 -2.8041 -1.23121e-06 0.616549 -1.87915e-06 8.0281L-1.37254e-05 143.533C-1.41116e-05 147.951 3.58171 151.533 7.99999 151.533L354 151.533C358.418 151.533 362 147.913 362 143.495C362 61.2874 362 79.4282 362 9.94625Z"
        fill="#F4E1C1"
      />
    </svg>
  );
};

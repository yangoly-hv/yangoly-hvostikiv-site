import { ISvgIconProps } from "@/shared/types";

export const CircleArrowIcon = ({
  className,
  color = "black",
  strokeWidth = "1.91662",
}: ISvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      className={className}
    >
      <path
        d="M13 23.6483C18.8807 23.6483 23.6479 18.8811 23.6479 13.0004C23.6479 7.11975 18.8807 2.35254 13 2.35254C7.11935 2.35254 2.35214 7.11975 2.35214 13.0004C2.35214 18.8811 7.11935 23.6483 13 23.6483Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3416 16.7596L10.5936 13.0009L14.3416 9.24219"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

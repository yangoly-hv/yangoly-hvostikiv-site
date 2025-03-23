import { ISvgIconProps } from "@/shared/types";

export const CardIcon = ({ ...props }: ISvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      {...props}
    >
      <path
        d="M2 12.4062C2 8.63525 2 6.74925 3.172 5.57825C4.344 4.40725 6.229 4.40625 10 4.40625H14C17.771 4.40625 19.657 4.40625 20.828 5.57825C21.999 6.75025 22 8.63525 22 12.4062C22 16.1772 22 18.0632 20.828 19.2342C19.656 20.4052 17.771 20.4062 14 20.4062H10C6.229 20.4062 4.343 20.4062 3.172 19.2342C2.001 18.0622 2 16.1772 2 12.4062Z"
        stroke="#FF9332"
        strokeWidth="1.5"
      />
      <path
        d="M10 16.4062H6M14 16.4062H12.5M2 10.4062H22"
        stroke="#FF9332"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

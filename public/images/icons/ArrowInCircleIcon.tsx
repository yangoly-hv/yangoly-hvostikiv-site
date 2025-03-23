import { ISvgIconProps } from "@/shared/types";

export default function ArrowInCircleIcon({
  className,
  ...props
}: ISvgIconProps) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M16.9999 30.7495C24.5938 30.7495 30.7499 24.5934 30.7499 16.9995C30.7499 9.4056 24.5938 3.24951 16.9999 3.24951C9.40596 3.24951 3.24988 9.4056 3.24988 16.9995C3.24988 24.5934 9.40596 30.7495 16.9999 30.7495Z"
        stroke="currentColor"
        strokeWidth="2.475"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2675 21.8535L20.1075 16.9997L15.2675 12.146"
        stroke="currentColor"
        strokeWidth="2.475"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

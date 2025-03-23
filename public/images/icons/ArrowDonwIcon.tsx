import { ISvgIconProps } from "@/shared/types";

export const ArrowDonwIcon = ({ className, ...props }: ISvgIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="currentColor"
      className={`w-6 h-6 ${className}`}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.9386 15.9112C12.548 16.3017 11.9149 16.3017 11.5243 15.9112L6.52434 10.9112C6.13381 10.5207 6.13381 9.88752 6.52434 9.49699C6.91486 9.10647 7.54803 9.10647 7.93855 9.49699L12.2314 13.7899L16.5243 9.49699C16.9149 9.10647 17.548 9.10647 17.9386 9.49699C18.3291 9.88752 18.3291 10.5207 17.9386 10.9112L12.9386 15.9112Z"
      />
    </svg>
  );
};

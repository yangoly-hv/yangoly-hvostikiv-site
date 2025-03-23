import { ISvgIconProps } from "@/shared/types";

export const CloseIcon = ({
  color,
  variant = "primary",
  ...props
}: ISvgIconProps) => {
  if (variant === "primary")
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill={color}
        {...props}
      >
        <g clipPath="url(#clip0_215_8624)">
          <path
            d="M4 20.1006L20 4.10059"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 4L20 20"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_215_8624">
            <rect
              width="24"
              height="24"
              fill="white"
              transform="translate(0.240234 0.174072)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  else if (variant === "secondary")
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        {...props}
      >
        <path
          d="M13.5747 11.9992L18.7489 6.82491C18.8389 6.73535 18.8895 6.61363 18.8895 6.48668C18.8895 6.35974 18.8389 6.23802 18.7489 6.14846L17.8504 5.24991C17.7608 5.15995 17.6391 5.10938 17.5122 5.10938C17.3852 5.10938 17.2635 5.15995 17.1739 5.24991L11.9997 10.4242L6.8254 5.24991C6.73583 5.15995 6.61412 5.10938 6.48717 5.10938C6.36023 5.10938 6.23851 5.15995 6.14894 5.24991L5.2504 6.14846C5.16044 6.23802 5.10986 6.35974 5.10986 6.48668C5.10986 6.61363 5.16044 6.73535 5.2504 6.82491L10.4247 11.9992L5.2504 17.1735C5.16044 17.263 5.10986 17.3847 5.10986 17.5117C5.10986 17.6386 5.16044 17.7603 5.2504 17.8499L6.14894 18.7485C6.23851 18.8384 6.36023 18.889 6.48717 18.889C6.61412 18.889 6.73583 18.8384 6.8254 18.7485L11.9997 13.5742L17.1739 18.7485C17.2635 18.8384 17.3852 18.889 17.5122 18.889C17.6391 18.889 17.7608 18.8384 17.8504 18.7485L18.7489 17.8499C18.8389 17.7603 18.8895 17.6386 18.8895 17.5117C18.8895 17.3847 18.8389 17.263 18.7489 17.1735L13.5747 11.9992Z"
          fill="black"
        />
      </svg>
    );
};

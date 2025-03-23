import { ICheckBoxIconProps } from "@/shared/types";

export const CheckboxIcon = ({
  variant = "default",
  ...props
}: ICheckBoxIconProps) => {
  if (variant === "default")
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        {...props}
      >
        <rect
          x="3.83337"
          y="3.83325"
          width="12.3333"
          height="12.3333"
          rx="1.25"
          stroke="#4E5053"
        />
      </svg>
    );
  else if (variant === "error")
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        {...props}
      >
        <rect
          x="3.83337"
          y="3.83325"
          width="12.3333"
          height="12.3333"
          rx="1.25"
          stroke="#CF0303"
        />
      </svg>
    );
  else if (variant === "checked")
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        {...props}
      >
        <path
          d="M15.238 16.6666H4.76182C3.97285 16.6666 3.33325 16.027 3.33325 15.238V4.76182C3.33325 3.97285 3.97285 3.33325 4.76182 3.33325H15.238C16.027 3.33325 16.6666 3.97285 16.6666 4.76182V15.238C16.6666 16.027 16.027 16.6666 15.238 16.6666ZM9.14611 13.748L14.6223 8.27182C14.8082 8.08587 14.8082 7.78444 14.6223 7.59849L13.949 6.92516C13.763 6.73926 13.4616 6.73926 13.2756 6.92516L8.80944 11.3913L6.7242 9.30563C6.53825 9.11974 6.23682 9.11974 6.05087 9.30563L5.37754 9.97944C5.19164 10.1654 5.19164 10.4668 5.37754 10.6528L8.47278 13.748C8.65873 13.9339 8.96016 13.9339 9.14611 13.748Z"
          fill="#FF9332"
        />
      </svg>
    );
};

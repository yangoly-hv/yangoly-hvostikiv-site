import { IPaymentButtonProps } from "@/shared/types";
import { CardIcon, GoogleIcon } from "../../../../../public/images/icons";

const PaymentButton = ({
  paymentType,
  className = "",
  text,
  ...props
}: IPaymentButtonProps) => {
  const getButtonContent = () => {
    switch (paymentType) {
      case "monoPay":
        return (
          <div className="flex items-center justify-center gap-1">
            <span>Зробити донат</span>
            {/*<span className="bg-white text-black px-1 rounded">Pay</span>*/}
          </div>
        );
      case "googlePay":
        return (
          <div className="flex items-center justify-center">
            <GoogleIcon />
          </div>
        );
      case "card":
        return (
          <div className="flex items-center justify-center gap-2">
            <CardIcon />
            <span className="text-[#FF9332]">{text}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonStyles = () => {
    switch (paymentType) {
      case "monoPay":
      case "googlePay":
        return "bg-black text-white hover:bg-gray-800 transition-all duration-300";
      case "card":
        return "bg-white border-t border-[#D9D9D9] hover:bg-orange-50/50 hover:border-[#FF9332] transition-all duration-300 ";
      default:
        return "";
    }
  };

  const getButtonHeight = () => {
    return paymentType === "googlePay" ? "h-[50px]" : "py-3";
  };

  return (
    <button
      type="button"
      className={`w-full rounded-[36px] transition-all ${getButtonHeight()} ${getButtonStyles()} ${className}`}
      {...props}
    >
      {getButtonContent()}
    </button>
  );
};

export default PaymentButton;

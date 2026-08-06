import { ComponentProps, ReactNode } from "react";
import type { AppLocale } from "@/shared/config/site";
import {
  IInformationBlockTranslation,
  ITails,
} from "./dictionary.types";
import type { PortableTextContentBlock } from "./content.types";
import type { DonationTarget } from "./donation";
import { Link } from "@/i18n/navigation";

export type Locale = AppLocale;
export type ButtonVariant = "primary" | "secondary" | "orange" | "outline";

export interface ILanguage {
  name: string;
  icon: React.ReactNode;
}

export interface ILanguages {
  [key: string]: ILanguage;
}

export type LocalePageParams<
  TLocale extends string = Locale,
  TExtraParams extends Record<string, string | undefined> = Record<never, never>,
> = {
  params: Promise<{ locale: TLocale } & TExtraParams>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};
export type PageParams<TExtraParams extends Record<string, string | undefined> = Record<never, never>> =
  LocalePageParams<Locale, TExtraParams>;
export type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export interface IDonateProps {
  className?: string;
  buttonText: string;
  title: string;
  donationTarget?: DonationTarget;
}

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

interface IFundraisingGoalStyleProps {
  titleClassName?: string;
  goalClassName?: string;
  currentAmountClassName?: string;
}

export interface IFundraisingGoalProps extends ComponentProps<"div"> {
  fundraisingTitle: string | undefined;
  subtitle?: string;
  goal: string;
  currency: string;
  totalAmount: number;
  currentAmount: number;
  styles?: IFundraisingGoalStyleProps;
  imageVariant?: "big" | "small" | "middle";
}

export interface IPartnersProps
  extends React.HtmlHTMLAttributes<HTMLTableSectionElement> {
  withTitle?: boolean;
}

export interface ISvgIconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "primary" | "secondary";
  color?: string;
  strokeWidth?: string;
}

export interface ILogoProps extends ComponentProps<typeof Link> {
  variant?: "black" | "color";
  className: string;
}

export interface IInfoBlockProps extends ComponentProps<"div"> {
  translation: IInformationBlockTranslation;
  /** Optional raw Portable Text-style blocks (e.g. from Sanity) */
  blocks?: PortableTextContentBlock[];
  children?: React.ReactNode;
  titleClassName?: string;
}

interface IImage {
  src: string;
  alt: string;
}

export interface IImageGalleryProps extends ComponentProps<"div"> {
  images: IImage[];
  variant: "splitLayout" | "fourGrid";
}

export interface IAmountCardProps {
  amount: number;
  formattedAmount: string;
  isSelected: boolean;
  currency: string;
  onClick: (amount: number) => void;
}

export interface ICustomAmountCardProps {
  value: string;
  isSelected: boolean;
  currency: string;
  anotherAmount: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  formatAmount: (amount: number) => string;
}

export interface ITextInputProps
  extends Omit<ComponentProps<"input">, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export interface ICheckBoxProps
  extends Omit<ComponentProps<"input">, "onChange" | "type"> {
  label: ReactNode;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

export interface CheckboxIconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "default" | "error" | "checked";
}

type PaymentType = "monoPay" | "googlePay" | "card";

export interface IPaymentButtonProps
  extends ComponentProps<"button"> {
  paymentType: PaymentType;
  text?: string;
}

export interface IDonateModalProps {
  title?: string;
  donationTarget?: DonationTarget;
  isOpen: boolean;
  onClose: () => void;
}

export interface IKeepingModalProps {
  isOpen: boolean;
  onClose: () => void;
  price?: number;
  donationTarget?: DonationTarget;
}

export interface IThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export interface IMonthlyGoalSectionProps {
  lang: Locale;
}

export interface IModalProps extends ComponentProps<"div"> {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  modalClassName?: string;
}

export interface ISlidesPaginationProps extends ComponentProps<"button"> {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}
export interface IAdoptModalProps {
  isOpen: boolean;
  onClose: () => void;
  translation: ITails;
}

export interface IHelpVolonteeringTranslation {
  title: string;
  paragraphs?: string[];
  /** Intro paragraph (first text block) */
  text?: string;
  /** Label before the bullet list (second text block), e.g. "Що потрібно робити:" */
  listLabel?: string;
  imagePath: string;
  imagePathDesk?: string;
  bg: string;
  buttonText?: string;
}

export interface IAngelsProps extends ComponentProps<"section"> {
  title?: string;
  withCircle?: boolean;
}

export interface IPartnershipHelpCard {
  title: string;
  text: string;
  bgColor: string;
  imgPath?: string;
  widthMob: number;
  heightMob: number;
  widthDesk: number;
  heightDesk: number;
  topMob: number;
  topDesk: number;
  rightMob: number;
  rightDesk: number;
}

export interface IWhatWeHaveItem {
  title: string;
  text: string;
  imgPath: string;
  bgPath: string;
  bgColor: string;
}

export interface IVolunteeringCardProps extends ComponentProps<"li"> {
  index: number;
  item: IHelpVolonteeringTranslation;
  className?: string;
}
export interface IHelpAnimalsListItem {
  title: string;
  subtitle: string;
  titleIcon: string;
  buttonText: string;
  paragraphs: { text: string; textMob: string; icon: string }[];
}

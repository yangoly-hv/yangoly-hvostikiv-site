import { ComponentProps } from "react";
import { dictionaries } from "../utils/getDictionary";
import {
  IAboutTranslation,
  IBlog,
  IChangeLifeTranslation,
  IDonateModalTranslation,
  IHeroTranslation,
  IInformationBlockTranslation,
  INavigationItem,
  IPartenrsTranslation,
  IPartnershipTranslation,
  IReporting,
  ITails,
  IAngelsTranslation,
  IMonthlyGoalSectionTranslation,
} from "./dictionary.types";
import * as yup from "yup";
import Link from "next/link";

export type Locale = keyof typeof dictionaries;
export type ButtonVariant = "primary" | "secondary" | "orange" | "outline";

export interface ILanguage {
  name: string;
  icon: React.ReactNode;
}

export interface ILanguages {
  [key: string]: ILanguage;
}

export type PageParams = {
  params: Promise<{ locale: Locale; id?: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};
export type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export interface IHeaderProps {
  translation: {
    navigation: INavigationItem[];
    donateButton: string;
  };
  donateModalTranslataion: IDonateModalTranslation;
  lang: Locale;
}

export interface IBurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  translation: {
    navigation: INavigationItem[];
    donateButton: string;
  };
  donateModalTranslataion: IDonateModalTranslation;
  lang: Locale;
}

export interface IHeroProps {
  translation: IHeroTranslation;
}

export interface IChangeLifeProps {
  translation: IChangeLifeTranslation;
}

export interface IAngelsMobProps {
  translation?: IAngelsTranslation;
  lang?: Locale;
  donateModalTranslataion?: IDonateModalTranslation;
}

export interface IDonateProps {
  className?: string;
  buttonText: string;
}

export interface IAboutProps {
  translation: IAboutTranslation;
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
  fundraisingTitle: string;
  subtitle?: string;
  goal: string;
  currency: string;
  totalAmount: number;
  currentAmount: number;
  styles?: IFundraisingGoalStyleProps;
  imageVariant?: "big" | "small" | "middle";
}

export interface IProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  totalAmount: number;
  currentAmount: number;
  height?: string;
}

export interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  withProgressBar?: boolean;
  goal?: string;
  currency?: string;
  currentAmount?: number;
  totalAmount?: number;
  onClick?: () => void;
  buttonText?: string;
  image: string;
  buttonStyle?: string;
}

export interface IPartnersProps
  extends React.HtmlHTMLAttributes<HTMLTableSectionElement> {
  translation: IPartenrsTranslation;
  withTitle?: boolean;
}

export interface IFormField {
  name: string;
  label: string;
  type: "text" | "tel" | "textarea" | "password";
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  validation?: yup.AnySchema;
  mask?: string;
}

export interface IFormConfig {
  title?: string;
  fields: IFormField[];
  submitText: string;
  onSubmit?: (data: Record<string, string>) => void;
  className?: string;
}

export interface ISvgIconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "primary" | "secondary";
  color?: string;
  strokeWidth?: string;
}

export interface ICheckBoxIconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "default" | "error" | "checked";
}

export interface ILogoProps extends ComponentProps<typeof Link> {
  variant?: "black" | "color";
  className: string;
}

export interface IInfoBlockProps extends ComponentProps<"div"> {
  translation: IInformationBlockTranslation;
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
  label: string;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

type PaymentType = "monoPay" | "googlePay" | "card";

export interface IPaymentButtonProps
  extends Omit<ComponentProps<"button">, "type"> {
  paymentType: PaymentType;
  text?: string;
}

export interface IDonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export interface ICardPaymentFormProps {
  onSubmit: (data: ICardPaymentFormData) => void;
  lang: Locale;
}

export interface ICardPaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
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
  translation: IMonthlyGoalSectionTranslation;
  lang: Locale;
  donateModalTranslataion: IDonateModalTranslation;
}

export interface IAnimatedSectionProps {
  children: React.ReactNode;
  initial?: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
  };
  whileInView?: {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
  };
  transition?: {
    duration?: number;
    delay?: number;
    ease?: string | number[];
  };
  amount?: number;
}

export interface IPartnershipProps {
  translation: IPartnershipTranslation;
  lang: Locale;
}

export interface IModalProps extends ComponentProps<"div"> {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  modalClassName?: string;
}

export interface ITailInfoProps {
  tail: ITailItem;
  locale: Locale;
  translation: ITails;
}

export interface IBlogProps {
  translation: IBlog;
  lang: Locale;
}

export interface INewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  mainPart: {
    lists: { title: string; items: string[] }[];
    text: string;
  };
  mainPhoto: string;
  secondaryPhoto: string;
}

export interface ITailItem {
  id: string;
  image: string;
  images: string[];
  name: string;
  description: string[];
  sex: string;
  sterilized: string;
  categories: string[];
}

export interface IBlogCardProps {
  blogItem: INewsItem;
  className?: string;
  translation: IBlog;
}

export interface IBlogListProps {
  lang: Locale;
  translation: IBlog;
}

export interface IBlogArticleProps {
  article: INewsItem;
  translation: IBlog;
}

export interface ITailsProps {
  translation: ITails;
  lang: Locale;
}

export interface IRandomTailCardsProps {
  translation: ITails;
  tails: ITailItem[];
}

export interface ITailProps {
  translation: ITails;
  tail: ITailItem;
  randomTails: ITailItem[];
  locale: Locale;
}

export interface IFundraisingCardProps {
  image: string;
  title: string;
  totalAmount: number;
  currentAmount: number;
  currency: string;
  buttonText: string;
  goal: string;
  onClick: () => void;
  className?: string;
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

export interface IReportingProps {
  translation: IReporting;
  lang: Locale;
}

export interface IReportingListProps {
  lang: Locale;
}

export interface IReportItem {
  id: string;
  date: string;
  title: string;
  description: string;
  mainPart: string[];
  mainPhoto: string;
  secondaryPhoto: string;
}

export interface IReportProps {
  report: IReportItem;
}

export interface IHelpVolonteeringTranslation {
  title: string;
  paragraphs?: string[];
  text?: string;
  imagePath: string;
  imagePathDesk?: string;
  bg: string;
  buttonText?: string;
}

export interface IAngelsProps extends ComponentProps<"section"> {
  title?: string;
  withCircle?: boolean;
}

export interface IPartnerItem {
  title: string;
  image: {
    imagePath: string;
    widthMob: number;
    heightMob: number;
    widthDesk: number;
    heightDesk: number;
    bg?: string;
  };
  text: string;
  buttonText: string;
  buttonLink: string;
}

export interface IPartnersSupport {
  title: string;
  list: {
    imgPath: string;
    text: string;
  }[];
}

export interface IWhatWeHaveItem {
  title: string;
  text: string;
  imgPath: string;
  bgPath: string;
}

export interface IVolunteeringCardProps extends ComponentProps<"li"> {
  index: number;
  item: IHelpVolonteeringTranslation;
  className?: string;
}

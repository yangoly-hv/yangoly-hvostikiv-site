export interface INavigationItem {
  name: string;
  href: string;
}

export interface IContacts {
  phone: string;
  email: string;
  address: string;
}

interface ISegment {
  text: string;
  bold: boolean;
}

interface IParagraph {
  segments: ISegment[];
  style?: string;
  listItem?: string;
}

interface ILink {
  text: string;
  href: string;
}

export interface IInformationBlockTranslation {
  title: string;
  paragraphs: IParagraph[];
  links?: ILink[];
  modalTitle?: string;
}

export interface IWorkResult {
  name: string;
  amount: string;
}

export interface IFilterOption {
  label: string;
  value: string;
}

export interface IBlog {
  title: string;
  timeToRead: string;
  detailsButton: string;
}

export interface ITails {
  detailsButton: string;
  allTails: string;
  adoptButton: string;
  oneTimeHelpButton: string;
  adoptDescription: string;
  name: string;
  connectButton: string;
  sterilize: string;
  becomeGuardianButton: string;
  supportText: string;
}

export interface IReporting {
  title: string;
}

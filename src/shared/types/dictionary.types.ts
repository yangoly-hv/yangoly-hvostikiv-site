export interface INavigationItem {
  name: string;
  href: string | { pathname: string; query?: Record<string, string | number> };
  dropdown?: {
    name: string;
    href:
      | string
      | { pathname: string; query?: Record<string, string | number> };
  }[];
}

export interface IHeroTranslation {
  title: string;
  subtitle: string;
  text: string;
  button: string;
}

export interface IChangeLifeTranslation {
  title: string;
  description: string;
  becomePartner: string;
  joinVolunteers: string;
}

export interface IAngelsTranslation {
  title: string;
  makeContribution: string;
  hrn: string;
  donor: string;
  sum: string;
}

interface ISegment {
  text: string;
  bold: boolean;
}

interface IParagraph {
  segments: ISegment[];
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

export interface IAboutOwnerTranslation {
  title: string;
  paragraphs: IParagraph[];
}

export interface IAboutTranslation {
  aboutUs: IInformationBlockTranslation;
  aboutOwner: IInformationBlockTranslation;
}

export interface IMonthlyGoalSectionTranslation {
  generalGoal: string;
  result: string;
  supportFundrasing: string;
}

export interface IWorkResult {
  count: string;
  action: string;
}

export interface IPartenrsTranslation {
  title: string;
}

export interface IContactsTranslation {
  title: string;
  subtitle: string;
}

export interface IDonateAmountSectionTranslation {
  title: string;
  anotherAmount: string;
  inputPlaceholder: string;
  inputLabel: string;
  firstCheckboxLabel: string;
  secondCheckboxLabel: string;
  cardButton: string;
  submitError: string;
}

export interface IDonateModalTranslation {
  fundraisingTitle: string;
  subtitle: string;
  currency: string;
  goal: string;
  donateAmountSection: IDonateAmountSectionTranslation;
}

export interface IPartnershipTranslation {
  hero: {
    title: string;
    button: string;
  };
  content: {
    title: string;
    description: string;
    sections: {
      title: string;
      items: string[];
    }[];
    buttons: {
      partner: string;
      documents: string;
    };
  };
  modalTitle: string;
}

export interface ISterilizationData {
  title: string;
  paragraphs: {
    segments: {
      text: string;
      bold: boolean;
    }[];
  }[];
}

export interface IFilterOption {
  label: string;
  value: string;
}

export interface IChairtyEvents {
  title: string;
  paragraphs: string[];
  benefitsTitle: string;
  benefitsParagraphs: string[];
  missionTitle: string;
  missionParagraph: string;
  botParagraphs: string[];
  buttons: string[];
  partnerModalTitle: string;
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
}

export interface IReporting {
  title: string;
}

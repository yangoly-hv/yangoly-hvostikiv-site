export type PortableTextContentBlock = {
  _key?: string;
  _type?: string;
  style?: string;
  listItem?: string;
  children?: Array<{ _key?: string; text?: string; marks?: string[] }>;
};

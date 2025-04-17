import { IAngelsDeskProps } from "@/shared/types";

export default function AngelsDesk({ translation, lang }: IAngelsDeskProps) {
  const { title, makeContribution } = translation;

  return <div className="hidden md:block">AngelsDesk</div>;
}

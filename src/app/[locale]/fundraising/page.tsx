import { permanentRedirect } from "next/navigation";
import { PageParams } from "@/shared/types";
import { localizedPath } from "@/shared/config/site";

export default async function CharityEventPage({ params }: PageParams) {
  const { locale } = await params;
  permanentRedirect(localizedPath(locale, "/charity-events"));
}

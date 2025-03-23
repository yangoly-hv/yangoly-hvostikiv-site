"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/shared/components/Button/Button";
import { ISterilizationData, Locale } from "@/shared/types";
import { getDictionary } from "@/shared/utils";
import DonateModal from "@/shared/components/DonateModal/DonateModal";

export default function SterilizationPage() {
  const [localTranslation, setLocalTranslation] =
    useState<ISterilizationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const lang = pathname.split("/")[1] as Locale;

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const { sterilization } = await getDictionary(lang);
        setLocalTranslation(sterilization);
      } catch (error) {
        console.error("Error fetching translation:", error);
      }
    };

    fetchTranslation();
  }, [lang]);

  if (!localTranslation) return null;

  return (
    <section className=" mx-auto mt-[30px]  container py-8 px-4">
      <div className="bg-white xl:flex xl:p-0">
        <h2 className="text-[24px] pt-5 xl:pt-0 xl:hidden text-center xl:text-left xl:text-[32px] text-black leading-[130%] mb-6">
          {localTranslation.title}
        </h2>
        <div className="relative w-full xl:w-[43%] aspect-[361/280] xl:aspect-[610/583] xl:h-auto">
          <Image
            src="/images/sterilization.jpg"
            alt="Foundation Owner"
            fill
            className="object-cover xl:h-full"
            sizes="(max-width: 1280px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="xl:w-[57%] xl:pl-8 xl:pr-4 xl:py-5 xl:flex xl:flex-col justify-center">
          <h2 className="hidden xl:block text-[24px] text-center xl:text-left xl:text-[32px] text-black leading-[130%] mb-6">
            {localTranslation.title}
          </h2>
          <div className="space-y-6 p-5 xl:p-0">
            {localTranslation.paragraphs?.map((paragraph, index) => (
              <p key={index} className="text-black text-[18px] leading-[130%]">
                {paragraph.segments?.map((segment, segIndex) => (
                  <span
                    key={segIndex}
                    className={segment.bold ? "font-bold" : "font-normal"}
                  >
                    {segment.text}
                  </span>
                ))}
              </p>
            ))}
            <div className="flex flex-col gap-4 xl:flex-row">
              <Button
                onClick={() => setIsModalOpen(true)}
                text={lang === "uk" ? "Підтримати" : "Support"}
              />
              <Button
                variant="outline"
                text={
                  lang === "uk"
                    ? "Потребують стерилізації"
                    : "Needs sterilization"
                }
                onClick={() =>
                  router.push(
                    `/${lang}/tails?filter=needs-sterilization&page=1`
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
      <DonateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
      />
    </section>
  );
}

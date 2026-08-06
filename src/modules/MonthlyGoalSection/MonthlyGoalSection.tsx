import Image from "next/image";
import { IMonthlyGoalSectionProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import Donate from "@/shared/components/Donate/Donate";
import { getTranslations } from "next-intl/server";

import { getMainCollection } from "@/features/home/server/data";
import { imageUrlForSlot } from "@/shared/lib/sanityImage";

const fallbackImageUrl = "/images/home/monthlyGoal/dog.webp";

const getAmount = (value: unknown) => {
  const amount = typeof value === "number" ? value : Number(value);

  return Number.isFinite(amount) ? amount : 0;
};

const formatAmount = (amount: number) => amount.toLocaleString("uk-UA");

const MonthlyGoalSection = async ({ lang }: IMonthlyGoalSectionProps) => {
  const t = await getTranslations("");
  const { generalGoal, result, supportFundrasing, support } = await t.raw(
    "MonthlyGoalSection"
  );
  const data = await getMainCollection();
  if(!data) return null;

  const title = data.title?.[lang] ?? data.title?.uk ?? "";
  const description = data.description?.[lang]?.[0]?.children?.[0]?.text ?? "";
  const image = data.image;
  const imageUrl = imageUrlForSlot(image, "collectionMonthlyGoal") || fallbackImageUrl;
  const goal = getAmount(data.amount);
  const current = getAmount(data.amountCollected);
  const [generalGoalBefore, generalGoalAfter = ""] = generalGoal.split("{{goal}}");

  const formattedResult = result
    .replace("{{goal}}", formatAmount(goal))
    .replace("{{current}}", formatAmount(current));

  return (
    <section className="relative pt-[120px] pb-[60px] bg-white md:bg-transparent overflow-hidden">
      <AnimatedWrapper
        animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
        className="md:hidden absolute top-[-18px] left-[calc(50%-205px)] w-[429px] h-[630px]"
      >
        <Image
          src="/images/home/monthlyGoal/housesMob.svg"
          alt="houses"
          width="429"
          height="630"
          className="w-full h-full object-cover"
        />
      </AnimatedWrapper>
      <div className="container px-4 xl:px-10 mx-auto">
        <div className="relative md:flex justify-between rounded-[8px] md:bg-white overflow-hidden">
          <AnimatedWrapper
            animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
            className="hidden md:block absolute top-[-26px] left-[-18px] md:w-[382px] lg:w-[502px] xl:w-[622px] laptop:w-[642px] desk:w-[802px] aspect-642/583 h-auto"
          >
            <Image
              src="/images/home/monthlyGoal/housesDesk.svg"
              alt="houses"
              width="642"
              height="583"
              className="w-full h-full object-cover"
            />
          </AnimatedWrapper>
          <div className="md:flex flex-col justify-between md:w-1/2 md:p-10 xl:py-[89px] xl:px-[81px] rounded-[8px] z-10">
            <div className="lg:max-w-[348px] xl:max-w-[555px]">
              <AnimatedWrapper
                as="h2"
                animation={fadeInAnimation({ y: 30 })}
                className="mb-3 xl:mb-4 desk:mb-14 font-arial text-[18px] xl:text-[40px] leading-[120%] text-center md:text-left"
              >
                {title}
              </AnimatedWrapper>
              <AnimatedWrapper
                as="p"
                animation={fadeInAnimation({ y: 30, delay: 0.4 })}
                className="mb-6 xl:mb-[37px] desk:mb-20 text-[12px] xl:text-[18px] leading-[130%] text-center md:text-left"
              >
                {description}
              </AnimatedWrapper>
              <AnimatedWrapper
                animation={fadeInAnimation({ x: 30, delay: 0.4 })}
                className="md:hidden relative h-[290px] mx-auto mb-6 rounded-[8px] overflow-hidden"
              >
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </AnimatedWrapper>
              <AnimatedWrapper
                as="h3"
                animation={fadeInAnimation({ y: 30, delay: 0.4 })}
                className="mb-[11px] xl:mb-6 font-arial text-[18px] xl:text-[24px] leading-[120%] text-center md:text-left"
              >
                {generalGoalBefore}
                <span className="text-green">
                  {formatAmount(goal)}
                </span>
                {generalGoalAfter}
              </AnimatedWrapper>
            </div>
            <div>
              <Donate
                  title={`${support} ${title}`}
                donationTarget={{ purpose: "collection", targetId: data._id, targetName: title, amount: goal, amountCollected: current }}
                className="w-full lg:max-w-[348px] xl:max-w-[555px] mb-3 desk:mb-8 xl:h-[67px]"
                buttonText={supportFundrasing}
              />
              <AnimatedWrapper
                as="p"
                animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
                className="text-[12px] xl:text-[18px] font-arial font-light text-center leading-[130%]"
              >
                {formattedResult}
              </AnimatedWrapper>
            </div>
          </div>
          <AnimatedWrapper
            animation={fadeInAnimation({ x: 30, delay: 0.4 })}
            className="hidden md:block md:self-center md:shrink-0 relative w-[49.2%] aspect-705/580 rounded-[8px] overflow-hidden"
          >
            <Image
              src={imageUrl}
              alt={image?.alt ?? title ?? ""}
              fill
              sizes="50vw"
              className="object-cover"
            />
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
};

export default MonthlyGoalSection;

import Image from "next/image";
import { monthlyFundrasing } from "./mockedData";
import { IMonthlyGoalSectionProps } from "@/shared/types";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";
import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import Donate from "@/shared/components/Donate/Donate";

const MonthlyGoalSection = ({
  translation,
  lang,
}: IMonthlyGoalSectionProps) => {
  const monthlyFundrasingLocalized = monthlyFundrasing[lang];
  const { title, description, image, goal, current } =
    monthlyFundrasingLocalized;
  const { generalGoal, result, supportFundrasing } = translation;

  const formattedResult = result
    .replace("{{goal}}", goal.toLocaleString("uk-UA"))
    .replace("{{current}}", current.toLocaleString("uk-UA"));

  return (
    <section className="relative mb-[124px] xl:mb-[200px] py-6 bg-white md:bg-transparent overflow-hidden">
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
            className="hidden md:block absolute top-[-26px] left-[-18px] md:w-[382px] lg:w-[502px] xl:w-[622px] laptop:w-[642px] desk:w-[802px] aspect-[642/583] h-auto"
          >
            <Image
              src="/images/home/monthlyGoal/housesDesk.svg"
              alt="houses"
              width="642"
              height="583"
              className="w-full h-full object-cover"
            />
          </AnimatedWrapper>
          <div className="md:flex flex-col justify-between md:w-1/2 md:p-10 xl:py-[89px] xl:px-[81px] rounded-[8px]">
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
                  src={image?.url}
                  alt={image?.alt}
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
                {generalGoal.split("{{goal}}")[0]}
                <span className="text-green">
                  {goal.toLocaleString("uk-UA")}
                </span>
                {generalGoal.split("{{goal}}")[1]}
              </AnimatedWrapper>
            </div>
            <div>
              <Donate
                className="w-full lg:max-w-[348px] xl:max-w-[555px] mb-3 desk:mb-8 xl:h-[67px]"
                buttonText={supportFundrasing}
              />
              <AnimatedWrapper
                as="p"
                animation={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
                className="text-[12px] xl:text-[18px] font-semibold text-center leading-[130%] uppercase"
              >
                {formattedResult}
              </AnimatedWrapper>
            </div>
          </div>
          <AnimatedWrapper
            animation={fadeInAnimation({ x: 30, delay: 0.4 })}
            className="hidden md:block relative w-[49.2%] aspect-[705/580] rounded-[8px] overflow-hidden"
          >
            <Image
              src={image?.url}
              alt={image?.alt}
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

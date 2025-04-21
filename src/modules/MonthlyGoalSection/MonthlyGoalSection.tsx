import { IMonthlyGoalSectionProps } from "@/shared/types";
import FirstBlock from "../../shared/components/MonthlyGoalBlocks/FirstBlock";
import SecondBlock from "../../shared/components/MonthlyGoalBlocks/SecondBlock";

const translations = {
  uk: {
    monthlyGoalTitle: "Наша ціль на місяць",
    fundraisingTitle: "Актуальний збір",
    goal: "Ціль",
    currency: "грн",
    donateButton: "Задонатити",
    octoberGoal:
      "У жовтні фонд збирає <span className='font-bold'>30000 грн</span> щоб закупити вакцини для тварин на прифронтових територіях. Вакцинація котів та собак забезпечує захист від серйозних захворювань.",
    vaccinationArgumentsTitle: "Аргументи на користь вакцинації:",
    arguments: [
      "Захист від інфекційних хвороб. Вакцини запобігають розвитку небезпечних інфекційних захворювань, таких як сказ, чумка, парвовірус та інші, які можуть бути смертельними для тварин. Вакцинація попереджає масштабні спалахи інфекцій.",
      "Безпека для людей. Деякі хвороби, як-от сказ, передаються від тварин до людей. Вакцинація тварин знижує ризик зараження людей.",
      "Довголіття та якість життя. Вакциновані тварини мають більші шанси на довге та здорове життя, оскільки їхній імунітет підготовлений до боротьби із серйозними хворобами.",
    ],
    conclusion:
      "Регулярна вакцинація котів і собак – це відповідальний крок для людей, який допомагає не лише зберегти здоров'я тварин, але й забезпечити безпеку громадян.",
  },
  en: {
    monthlyGoalTitle: "Our monthly goal",
    fundraisingTitle: "Current collection",
    goal: "Goal",
    currency: "UAH",
    donateButton: "Donate",
    vaccinationArgumentsTitle: "Arguments in favor of vaccination:",
    octoberGoal:
      "In October, the fund is raising <span style='font-weight: bold;'>30000 UAH</span> to purchase vaccines for animals in frontline territories. Vaccinating cats and dogs provides protection against serious diseases.",
    arguments: [
      "Protection against infectious diseases. Vaccines prevent the development of dangerous infectious diseases such as rabies, distemper, parvovirus, and others, which can be fatal to animals. Vaccination prevents large-scale outbreaks of infections.",
      "Safety for people. Some diseases, such as rabies, are transmitted from animals to humans. Vaccinating animals reduces the risk of human infection.",
      "Longevity and quality of life. Vaccinated animals have a better chance of living a long and healthy life, as their immune system is prepared to fight serious diseases.",
    ],
    conclusion:
      "Regular vaccination of cats and dogs is a responsible step for people, helping not only to preserve the health of animals but also to ensure the safety of citizens.",
  },
};
const MonthlyGoalSection = ({ lang }: IMonthlyGoalSectionProps) => {
  const t = translations[lang];
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
                lang={lang}
                donateModalTranslataion={donateModalTranslataion}
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

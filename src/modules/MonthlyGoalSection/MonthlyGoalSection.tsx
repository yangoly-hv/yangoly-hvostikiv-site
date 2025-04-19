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
    <section className="bg-green py-10 xl:py-0">
      <div className="container flex flex-col-reverse px-4 gap-[34px] justify-center mx-auto xl:flex-row xl:gap-[90px] xl:pt-[47px]">
        <FirstBlock lang={lang} buttonText={t.donateButton} t={t} />
        <SecondBlock t={t} />
      </div>
    </section>
  );
};

export default MonthlyGoalSection;

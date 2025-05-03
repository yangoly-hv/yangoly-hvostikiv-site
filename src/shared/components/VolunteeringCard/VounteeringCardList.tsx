import * as motion from "motion/react-client";
import Image from "next/image";
import VolunteeringCardMobile from "./VolunteeringCardMobile";
import clsx from "clsx";
import { IHelpVolonteeringTranslation } from "@/shared/types";
import VolunteeringCardDesk from "./VolunteeringCardDesk";
import ContactFormAction from "../ContactFormAction/ContactFormAction";

interface IVounteeringCardListProps {
  helpsList: IHelpVolonteeringTranslation[];
  formCard: IHelpVolonteeringTranslation;
}

const VounteeringCardList = async ({
  formCard,
  helpsList,
}: IVounteeringCardListProps) => {
  return (
    <>
      <ul className="grid xl:hidden grid-cols-1 md:grid-cols-2 mt-[18px] gap-5 pt-[18px] pb-[100px]  xl:grid-rows-6">
        {helpsList.map((item, index) => {
          return (
            <VolunteeringCardMobile
              className={clsx(
                index === 0 && "xl:row-span-3",
                index === 3 && "xl:row-span-3 xl:col-start-1 xl:row-start-4",
                index === 2 && "xl:row-span-2 xl:col-start-2 xl:row-start-1",
                index === 1 && "xl:row-span-2 xl:col-start-2 xl:row-start-3"
              )}
              index={index}
              key={index}
              item={item}
            />
          );
        })}
        <motion.li
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.8,
            duration: 0.6,
            ease: "easeOut",
          }}
          viewport={{ once: true, amount: 0.2 }}
          style={{ backgroundColor: formCard.bg }}
          className="pt-[23px] rounded-[8px] relative min-h-[340px] xl:row-span-2 xl:col-start-2 xl:row-start-5 "
        >
          <div className="px-6">
            <h3 className="font-arial text-center text-[24px] tracking-[-0.225px] leading-[141%]">
              {formCard.title}
            </h3>
            <p className="mt-3 text-[18px] font-medium leading-[133%] text-center">
              {formCard.text}
            </p>
            <div className="flex justify-center items-center">
              <ContactFormAction
                buttonText={formCard.buttonText ? formCard.buttonText : ""}
                className="mt-6 w-full h-[52px] max-w-[253px] "
              />
            </div>

            <Image
              src={formCard.imagePath}
              alt="Volunteering"
              width={282}
              height={282}
              className="object-bottom w-[282px] h-[282px] absolute bottom-0 left-1/2 -translate-x-1/2"
            />
          </div>
        </motion.li>
      </ul>
      {/* DESKTOP */}

      <div className=" gap-6 h-full hidden xl:flex pt-[32px] pb-[100px]">
        <ul className="flex flex-col gap-6 w-[50%] h-full">
          <VolunteeringCardDesk item={helpsList[0]} index={0} />
          <VolunteeringCardDesk item={helpsList[3]} index={3} />
        </ul>
        <ul className="flex flex-col gap-6 w-[50%] h-full">
          <VolunteeringCardDesk item={helpsList[2]} index={2} />
          <VolunteeringCardDesk item={helpsList[1]} index={1} />
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.6,
              ease: "easeOut",
            }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ backgroundColor: formCard.bg }}
            className="pt-[23px] rounded-[8px] relative min-h-[257px] xl:row-span-2 xl:col-start-2 xl:row-start-5 "
          >
            <div className="px-6">
              <h3 className="font-arial text-center text-[24px] tracking-[-0.225px] leading-[141%]">
                {formCard.title}
              </h3>
              <p className="mt-3 text-[18px] font-medium leading-[133%] text-center">
                {formCard.text}
              </p>
              <div className="flex justify-center items-center">
                <ContactFormAction
                  buttonText={formCard.buttonText ? formCard.buttonText : ""}
                  className="mt-6 w-full h-[52px] max-w-[253px] z-[2] "
                />
              </div>

              <Image
                src={formCard.imagePath}
                alt="Volunteering"
                width={282}
                height={282}
                className="object-bottom w-[282px] h-[282px] absolute bottom-0 left-1/2 -translate-x-1/2 z-[1]"
              />
            </div>
          </motion.li>
        </ul>
      </div>
    </>
  );
};

export default VounteeringCardList;

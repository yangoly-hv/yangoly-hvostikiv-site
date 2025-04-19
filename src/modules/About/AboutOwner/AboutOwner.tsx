import InfoBlock from "@/shared/components/InfoBlock/InfoBlock";
import { IAboutOwnerTranslation } from "@/shared/types";
import Image from "next/image";

import AnimatedWrapper from "@/shared/components/Animations/AnimationWrapper";
import { fadeInAnimation } from "@/shared/components/Animations/animationVariants";

const AboutOwner = ({
  translation,
}: {
  translation: IAboutOwnerTranslation;
}) => {
  return (
    <div className="bg-orange-bg">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-0">
        <InfoBlock
          titleClassName="xl:text-left"
          className="px-[30px] py-[40px] flex flex-col justify-center rounded-[20px] xl:px-[89px] xl:py-10"
          translation={translation}
        />
        <AnimatedWrapper
          as="div"
          animation={fadeInAnimation({ scale: 0.9, delay: 0.2 })}
          className="relative aspect-[722/689]  mx-auto xl:mx-0 xl:max-h-[680px] xl:w-full"
        >
          <Image
            src="/images/owner_2.jpg"
            alt="Foundation Owner"
            fill
            className="object-contain object-top rounded-[20px] xl:object-cover"
            quality={75}
            priority
          />
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default AboutOwner;

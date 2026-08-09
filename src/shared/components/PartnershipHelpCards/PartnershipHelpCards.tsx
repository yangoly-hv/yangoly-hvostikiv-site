import { IPartnershipHelpCard } from "@/shared/types";
import * as motion from "motion/react-client";
import { getTranslations } from "next-intl/server";
import SafeImage from "@/shared/components/SafeImage/SafeImage";
const PartnershipHelpCards = async () => {
  const t = await getTranslations("PartnershipHelpCards");
  const cards = (await t.raw("cards")) as IPartnershipHelpCard[];

  // Order for 2x2 grid: card1 (row1 col1), card3 (row1 col2), card2 (row2 col1), card4 (row2 col2)
  const gridOrder = [cards[0], cards[2], cards[1], cards[3]].filter(
    (card): card is IPartnershipHelpCard => card !== undefined,
  );

  return (
    <section className="container px-4 xl:px-[40px] mx-auto pb-[60px] lg:pb-[80px]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="uppercase text-center font-arial leading-[130%] text-[24px] lg:text-[44px] font-black mb-[40px] lg:mb-[64px]"
      >
        {t("title")}
      </motion.h2>

      <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-5">
        {gridOrder.map((card, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl px-[14px] pt-[32px] lg:p-8 flex flex-col h-[448px] lg:h-[332px] overflow-hidden relative"
            style={{ backgroundColor: card.bgColor }}
          >
            <div className="flex-1 flex flex-col relative">
              <h3 className="text-[24px] lg:text-[32px] max-w-[393px] font-arial leading-[117%] lg:leading-[106%] mb-3 lg:mb-6 tracking-[-0.22px]">
                {card.title}
              </h3>
              <p className="text-[14px] lg:text-[18px] max-w-[340px] leading-[112%] lg:leading-[133%] flex-1 tracking-[-0.22px]">
                {card.text}
              </p>
              {card.imgPath && (
                <>
                  <div className="absolute block lg:hidden"
                    style={{
                      top: card.topMob,
                      right: card.rightMob,
                      width: card.widthMob,
                      height: card.heightMob,
                    }}>
                    <SafeImage
                      src={card.imgPath}
                      alt=""
                      width={card.widthMob}
                      height={card.heightMob}
                      sizes="100vw"
                      className="object-contain"

                    />
                  </div>
                  <div className="absolute hidden lg:block" style={{
                    top: card.topDesk,
                    right: card.rightDesk,
                    width: card.widthDesk,
                    height: card.heightDesk,
                  }}>
                    <SafeImage
                      src={card.imgPath}
                      alt=""
                      width={card.widthDesk}
                      height={card.heightDesk}
                      sizes="50vw"
                      className="object-contain"
                    />
                  </div>
                </>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default PartnershipHelpCards;

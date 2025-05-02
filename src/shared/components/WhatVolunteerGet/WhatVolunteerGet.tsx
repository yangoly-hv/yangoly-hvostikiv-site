import { getTranslations } from "next-intl/server";
import WhatVolunteerGetMobile from "./WhatVolunteerGetMobile";
import WhatVolunteerGetDesk from './WhatVolunteerGetDesk';

const WhatVolunteerGet = async () => {
  const t = await getTranslations("VolunteeringPage.whatGet");
  const paragraphs = (await t.raw("paragraphs")) as string[];
  return (
    <>
      <WhatVolunteerGetMobile
        subtitle={t("subtitle")}
        title={t("title")}
        paragraphs={paragraphs}
      />
      <WhatVolunteerGetDesk
        subtitle={t("subtitle")}
        title={t("title")}
        paragraphs={paragraphs}
      />
    </>
  );
};

export default WhatVolunteerGet;

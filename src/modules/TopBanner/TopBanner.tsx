import SocialsList from "@/shared/components/SocialsList/SocialsList";
import { EmailIcon, PhoneIcon } from "../../../public/images/icons";
import { LocationIcon } from "../../../public/images/icons/LocationIcon";

const TopBanner = () => {
  return (
    <section className="hidden xl:flex px-20 py-3 bg-dark text-white justify-between items-center  w-full">
      <div className="flex gap-8">
        <a
          href="tel:+380992004080"
          className="flex items-center gap-2 text-[14px] font-medium hover:text-gray-200"
        >
          <PhoneIcon /> +380 97 200 24 00
        </a>
        <a
          href="mailto:email@gmail.com"
          className="flex items-center gap-2 text-[14px] font-medium hover:text-gray-200"
        >
          <EmailIcon /> angelsuaorg@gmail.com
        </a>
        <div className="flex items-center gap-2 text-[14px] font-medium">
          <LocationIcon /> Київ, вул. Шевченка, 25а
        </div>
      </div>
      <SocialsList iconClass="text-white" />
    </section>
  );
};

export default TopBanner;

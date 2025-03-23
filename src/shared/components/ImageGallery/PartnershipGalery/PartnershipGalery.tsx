import Image from "next/image";

const PartnershipGalery = () => {
  return (
    <div className="grid grid-cols-2 gap-5 mt-10 xl:mt-0">
      {/* Лівий стовпчик */}
      <div className="flex flex-col gap-5">
        <div className="relative aspect-[170/177] xl:aspect-[372/177] h-full">
          <Image
            src="/images/partners1.jpg"
            alt="Photo 1"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative aspect-[170/204] xl:aspect-[372/276] h-full">
          <Image
            src="/images/partners3.jpg"
            alt="Photo 3"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Правий стовпчик */}
      <div className="flex flex-col gap-5">
        <div className="relative aspect-[171/246] xl:aspect-[305/276] h-full">
          <Image
            src="/images/partners2.jpg"
            alt="Photo 2"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="relative aspect-[170/135] xl:aspect-[305/177] h-full">
          <Image
            src="/images/partners4.jpg"
            alt="Photo 4"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PartnershipGalery;

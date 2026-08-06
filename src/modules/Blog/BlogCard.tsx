import Image from "next/image";
import Button from "@/shared/components/Button/Button";
import type { BlogPostSummary } from "@/features/blog/model/types";
import type { IBlog } from "@/shared/types";
import { Link } from "@/i18n/navigation";
import * as motion from "motion/react-client";
import { fadeInAt, slideUpAt } from "@/shared/utils";
import PortableTextRenderer from "@/shared/components/PortableTextRenderer/PortableTextRenderer";

export default function BlogCard({
  blogItem,
  className = "",
  translation,
}: {
  blogItem: BlogPostSummary;
  className?: string;
  translation: IBlog;
}) {
  const { mainPhoto, date, title, description, slug } = blogItem;
  const { detailsButton } = translation;

  return (
    <div
      className={`flex flex-col justify-between h-full max-w-[343px] desk:max-w-[436px] pt-8 pb-5 px-6 bg-white rounded-[20px] shadow-blogCard ${className}`}
    >
      <div>
        {" "}
        {mainPhoto && (
          <motion.div
            variants={slideUpAt()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link href={`/blog/${slug}`} className="block mb-[26px]">
              <div className="relative w-full h-[246px] desk:h-[323px] aspect-295/246 rounded-[11.25px] overflow-hidden">
                <Image
                  src={mainPhoto}
                  alt={title}
                  fill
                  className="object-cover object-center rounded-[11.25px]"
                  sizes="(max-width: 1280px) 50vw, 33vw"
                />
              </div>
            </Link>
          </motion.div>
        )}
        {date && (
          <motion.p
            variants={fadeInAt(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-3 text-dark text-[16px] font-medium leading-[20.8px]"
          >
            {date}
          </motion.p>
        )}
        <motion.div
          variants={fadeInAt(0.4)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link href={`/blog/${slug}`}>
            <h2
              className="min-h-[52px] mb-3 text-dark text-[20px] font-semibold leading-[26px] line-clamp-2 focus-visible:text-primary-gray xl:hover:text-primary-gray
            transition duration-300 ease-out"
            >
              {title}
            </h2>
          </Link>
        </motion.div>
        <motion.div
          variants={fadeInAt(0.6)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-5 text-dark font-normal text-[14px] leading-[18.2px] line-clamp-4"
        >
          <PortableTextRenderer value={description} />
        </motion.div>
      </div>
      <motion.div
        variants={fadeInAt(0.8)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Link href={`/blog/${slug}`}>
          <Button text={detailsButton} fullWidth />
        </Link>
      </motion.div>
    </div>
  );
}

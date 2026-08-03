import { IImageGalleryProps } from "@/shared/types";
import Image from "next/image";
import { fadeInAnimation } from "../Animations/animationVariants";
import AnimatedWrapper from "../Animations/AnimationWrapper";

const ImageGallery = ({
  images,
  variant,
  className = "",
}: IImageGalleryProps) => {
  if (variant === "splitLayout") {
    const [mainImage, secondaryImage, tertiaryImage] = images;
    if (!mainImage || !secondaryImage) return null;
    return (
      <div className={`grid grid-cols-2 gap-4 xl:gap-5 ${className} h-full`}>
        <AnimatedWrapper
          className="relative w-full h-full"
          animation={fadeInAnimation({ y: 30, delay: 0.2 })}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="absolute inset-0">
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              className="object-cover object-right rounded-lg xl:rounded-[16px]"
              sizes="(max-width: 1280px) 50vw, 33vw"
              priority
            />
          </div>
        </AnimatedWrapper>
        <div className="flex flex-col gap-4 xl:gap-5 h-full">
          <AnimatedWrapper
            className="relative w-full aspect-329/331"
            animation={fadeInAnimation({ y: 30, delay: 0.4 })}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Image
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              fill
              className="object-cover rounded-lg xl:rounded-[16px]"
              sizes="(max-width: 1280px) 50vw, 33vw"
            />
          </AnimatedWrapper>
          {tertiaryImage && (
            <AnimatedWrapper
              className="relative w-full flex-1"
              animation={fadeInAnimation({ y: 30, delay: 0.6 })}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Image
                src={tertiaryImage.src}
                alt={tertiaryImage.alt}
                fill
                className="object-cover rounded-lg xl:rounded-[16px]"
                sizes="(max-width: 1280px) 50vw, 33vw"
              />
            </AnimatedWrapper>
          )}
        </div>
      </div>
    );
  }

  if (variant === "fourGrid") {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        {images.slice(0, 4).map((image, index) => (
          <AnimatedWrapper
            key={index}
            className="relative w-full aspect-square"
            animation={fadeInAnimation({ y: 30, delay: 0.2 + index * 0.2 })}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 1280px) 50vw, 33vw"
            />
          </AnimatedWrapper>
        ))}
      </div>
    );
  }

  return null;
};

export default ImageGallery;

"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { CircleArrowIcon, CloseIcon } from "../../../../public/images/icons";
import { cn } from "@/shared/utils";

const modalImageVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction === 0 ? 0 : direction * 80,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction === 0 ? 0 : direction * -80,
  }),
};

const ImageSlider = ({ images }: { images: string[] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbs, setThumbs] = useState(images.slice(0, 3));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDirection, setModalDirection] = useState(0);
  const selectedImage = images[selectedIndex];

  const handleThumbClick = (index: number) => {
    setSelectedIndex(index);
    if (index > 0 && index < images.length - 1) {
      setThumbs(images.slice(index - 1, index + 2));
    }
  };

  const openModal = useCallback(() => {
    setModalDirection(0);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalPrev = useCallback(() => {
    setModalDirection(-1);
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, [images.length]);

  const handleModalNext = useCallback(() => {
    setModalDirection(1);
    setSelectedIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, [images.length]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft" && images.length > 1) handleModalPrev();
      if (event.key === "ArrowRight" && images.length > 1) handleModalNext();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, handleModalNext, handleModalPrev, images.length, isModalOpen]);

  const modalImageSrc = isModalOpen ? images[selectedIndex] : "";

  if (!selectedImage) return null;

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 items-start w-full lg:w-auto lg:bg-white">
      <div className="flex lg:flex-col gap-[15px] lg:gap-6 w-full lg:w-auto max-w-[706px] lg:max-w-full mx-auto lg:mx-0">
        <AnimatePresence mode="popLayout">
          {thumbs.map((image) => {
            const globalIndex = images.indexOf(image);
            return (
              <motion.button
                key={image}
                layout
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={cn(
                  "relative aspect-6/5 min-w-[99px] lg:min-w-[101px] rounded-[6px] lg:rounded-[10px] cursor-pointer",
                  globalIndex === selectedIndex && "border-2 border-orange"
                )}
                onClick={() => handleThumbClick(globalIndex)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${globalIndex + 1}`}
                  fill={true}
                  className="object-cover rounded-[4px] lg:rounded-[8px]"
                />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <motion.div
        key={selectedIndex}
        className="w-full max-w-[420px] lg:max-w-full aspect-6/5 lg:w-[420px] xl:w-[500px] mx-auto lg:mx-0 relative rounded-[8px] lg:rounded-r-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          className="object-cover hover:scale-[1.05] transition duration-1000 ease-in-out cursor-pointer"
          src={selectedImage}
          alt={`Selected Image ${selectedIndex}`}
          fill={true}
          priority
          onClick={openModal}
        />
      </motion.div>

      {/* Модальне вікно */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
              className="relative w-full max-w-[1040px] aspect-13/10 overflow-hidden rounded-[8px] bg-black"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={modalDirection}>
                {modalImageSrc && (
                  <motion.img
                    key={`${selectedIndex}-${modalImageSrc}`}
                    src={modalImageSrc}
                    alt={`Image ${selectedIndex + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    custom={modalDirection}
                    variants={modalImageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.28, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              <button
                type="button"
                aria-label="Close image"
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 transition hover:bg-white"
              >
                <CloseIcon variant="secondary" className="h-6 w-6" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={handleModalPrev}
                    className="absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/45 p-0.5 transition hover:bg-white/80 lg:left-4 lg:p-1"
                  >
                    <CircleArrowIcon className="h-8 w-8 lg:h-12 lg:w-12" strokeWidth="1" color="black" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={handleModalNext}
                    className="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/45 p-0.5 transition hover:bg-white/80 lg:right-4 lg:p-1"
                  >
                    <CircleArrowIcon className="h-8 w-8 rotate-180 lg:h-12 lg:w-12" strokeWidth="1" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageSlider;

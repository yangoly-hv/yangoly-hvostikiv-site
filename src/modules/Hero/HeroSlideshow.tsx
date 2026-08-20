"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export type HeroSlide = {
  deskAvif: string;
  deskWebp: string;
  mobAvif: string;
  mobWebp: string;
  /** tailwind object-position class, e.g. "object-[center_45%]" */
  position: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  /** localized aria-label for the dots rail */
  railLabel: string;
  /** localized prefix for a dot button, index appended: "Фото 2" */
  slideLabelPrefix: string;
};

const SLIDE_DURATION = 4500;
const KENBURNS_CLASSES = ["kenburns-a", "kenburns-b", "kenburns-c"];

export default function HeroSlideshow({
  slides,
  railLabel,
  slideLabelPrefix,
}: HeroSlideshowProps) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState<Set<number>>(
    () => new Set([0, 1 % slides.length])
  );
  // Bumped when a slide becomes active: remounts its <img> while it is still
  // fully transparent, restarting the Ken Burns drift without a visible jump.
  const [epochs, setEpochs] = useState<number[]>(() => slides.map(() => 0));

  const goTo = useCallback(
    (index: number) => {
      if (index === active) return;
      setActive(index);
      setEpochs((eps) => {
        const next = [...eps];
        next[index] = (next[index] ?? 0) + 1;
        return next;
      });
      setMounted((prev) => {
        const next = new Set(prev);
        next.add(index);
        next.add((index + 1) % slides.length);
        return next;
      });
    },
    [active, slides.length]
  );

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      goTo((active + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [reducedMotion, slides.length, active, goTo]);

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {slides.map((slide, i) =>
          mounted.has(i) ? (
            <picture
              key={i}
              className="absolute inset-0 transition-opacity duration-[1100ms] ease-in-out"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <source
                media="(min-width: 768px)"
                type="image/avif"
                srcSet={slide.deskAvif}
              />
              <source
                media="(min-width: 768px)"
                type="image/webp"
                srcSet={slide.deskWebp}
              />
              <source type="image/avif" srcSet={slide.mobAvif} />
              <img
                key={epochs[i]}
                src={slide.mobWebp}
                alt=""
                decoding="async"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                className={`h-full w-full object-cover ${slide.position} ${
                  reducedMotion
                    ? ""
                    : KENBURNS_CLASSES[i % KENBURNS_CLASSES.length]
                }`}
              />
            </picture>
          ) : null
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/25 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/35 lg:to-black/30" />
        <div className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-black/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[120px] bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      <nav
        aria-label={railLabel}
        className="absolute bottom-[24px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-[10px] rounded-full px-[18px] py-[12px] liquid-glass-chip lg:bottom-[36px] lg:left-[40px] lg:translate-x-0 xl:left-[80px]"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${slideLabelPrefix} ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className="group flex h-[16px] items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span
              className={`block h-[7px] rounded-full transition-all duration-500 ${
                i === active
                  ? "w-[26px] bg-white"
                  : "w-[7px] bg-white/45 group-hover:bg-white/75"
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  );
}

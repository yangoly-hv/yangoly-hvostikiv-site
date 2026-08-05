"use client";

import { useCallback, useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";

export function useSwiperNavigation() {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  const syncNavigationState = useCallback((swiper: SwiperInstance) => {
    setIsPrevDisabled(swiper.isBeginning);
    setIsNextDisabled(swiper.isEnd);
  }, []);

  const onSwiper = useCallback(
    (swiper: SwiperInstance) => {
      swiperRef.current = swiper;
      syncNavigationState(swiper);
    },
    [syncNavigationState],
  );

  const previous = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const next = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  return {
    isPrevDisabled,
    isNextDisabled,
    onSwiper,
    onSlideChange: syncNavigationState,
    previous,
    next,
  };
}

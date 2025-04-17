export const fadeInAnimation = ({
    x = 0,
    y = 0,
    scale = 1,
    delay = 0,
    duration = 1,
    opacity = 0,
  }) => ({
    hidden: {
      opacity: opacity,
      transform: `translate3d(${x}px, ${y}px, 0) scale3d(${scale}, ${scale}, 1)`,
      willChange: "opacity, transform",
    },
    visible: {
      opacity: 1,
      transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)",
      transition: { duration, delay, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: { duration: 1, ease: "easeIn" },
    },
  });
  
  export const listVariants = ({
    staggerChildren = 0.5,
    delayChildren = 0,
  } = {}) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      transition: { duration: 1, ease: "easeIn" },
    },
  });
  
  export const listItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };
  
export const easing = {
  smooth: [0.22, 1, 0.36, 1],
  spring: [0.34, 1.56, 0.64, 1],
  bounce: [0.34, 1.56, 0.64, 1],
}

export const duration = {
  fast: 0.2,
  normal: 0.5,
  slow: 0.8,
  hero: 1.2,
}

export const stagger = {
  micro: 0.06,
  normal: 0.08,
  large: 0.12,
  xl: 0.15,
  xxl: 0.2,
}

export const animationVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  slideInRight: {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
  wordReveal: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  },
  countUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: duration.slow,
      ease: 'easeInOut',
    },
  },
  shake: {
    animate: {
      x: [0, -4, 4, -4, 4, 0],
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  },
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.normal,
      delayChildren: 0.1,
    },
  },
}

export const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.smooth,
    },
  },
}

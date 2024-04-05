import { easeOut } from 'framer-motion'

export const staggeredFadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      ease: easeOut,
      duration: 1,
    },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

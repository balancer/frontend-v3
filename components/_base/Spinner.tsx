'use client'
import { motion } from 'framer-motion'
import { CgSpinnerTwoAlt } from 'react-icons/cg'
import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'

const variants = cva('flex', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
      '9xl': 'text-9xl',
    },
    iconColor: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      destructive: 'text-destructive',
    },
  },
})

interface Props
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof variants> {}

export function Spinner({ size, iconColor, className, ...props }: Props) {
  return (
    <div
      className={cn(
        variants({
          size,
          iconColor,
          className,
        })
      )}
      {...props}
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <CgSpinnerTwoAlt />
      </motion.div>
    </div>
  )
}

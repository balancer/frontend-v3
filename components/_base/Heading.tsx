import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const variants = cva('', {
  variants: {
    as: {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-bold',
      h4: 'text-xl font-bold',
      h5: 'text-lg font-bold',
      h6: 'text-base font-bold',
    },
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
    family: {
      sans: 'font-sans',
      serif: 'font-serif',
      mono: 'font-mono',
    },
    italic: {
      true: 'italic',
    },
    weight: {
      thin: 'font-thin',
      extralight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
    numeric: {
      default: 'normal-nums',
      oldstyle: 'oldstyle-nums',
      lining: 'lining-nums',
      tabular: 'tabular-nums',
      proportional: 'proportional-nums',
      diagonal: 'diagonal-fractions',
      stacked: 'stacked-fractions',
      slashed: 'slashed-zero',
      ordinal: 'ordinal',
    },
    lineHeight: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    textColor: {
      default: 'text-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary',
      accent: 'text-accent',
      destructive: 'text-destructive',
    },
    decoration: {
      underline: 'underline',
      'line-through': 'line-through',
      'no-underline': 'no-underline',
      overline: 'overline',
    },
    overflow: {
      ellipsis: 'overflow-ellipsis',
      clip: 'overflow-clip',
      truncate: 'truncate',
    },
    wordBreak: {
      normal: 'break-normal',
      words: 'break-words',
      all: 'break-all',
      keep: 'break-keep',
    },
  },
  defaultVariants: {
    as: 'h1',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof variants> {
  children?: ReactNode
}

export function Heading({
  children,
  as,
  size,
  family,
  italic,
  weight,
  numeric,
  lineHeight,
  align,
  textColor,
  decoration,
  overflow,
  wordBreak,
  className,
  ...props
}: Props) {
  const Tag = as || 'h1'

  return (
    <Tag
      className={cn(
        variants({
          size,
          as,
          family,
          italic,
          weight,
          numeric,
          lineHeight,
          align,
          textColor,
          decoration,
          overflow,
          wordBreak,
          className,
        })
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

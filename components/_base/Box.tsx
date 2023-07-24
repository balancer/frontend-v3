import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const variants = cva('', {
  variants: {
    bg: {
      default: 'bg-background text-background-foreground',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      muted: 'bg-muted text-muted-foreground',
      accent: 'bg-accent text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
    },
    padd: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-8',
    },
    overflow: {
      hidden: 'overflow-hidden',
      visible: 'overflow-visible',
      scroll: 'overflow-scroll',
      auto: 'overflow-auto',
    },
    border: {
      none: 'border-0',
      default: 'border border-border',
      primary: 'border border-primary',
      secondary: 'border border-secondary',
      muted: 'border border-muted',
      accent: 'border border-accent',
      destructive: 'border border-destructive',
    },
    borderRadius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
    },
    width: {
      full: 'w-full',
      auto: 'w-auto',
    },
  },
  defaultVariants: {
    bg: 'default',
    padd: 'none',
    overflow: 'auto',
    border: 'none',
    borderRadius: 'none',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  children?: ReactNode
}

export function Box({
  children,
  bg,
  width,
  padd,
  overflow,
  border,
  borderRadius,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        variants({ bg, padd, overflow, border, width, borderRadius, className })
      )}
      {...props}
    >
      {children}
    </div>
  )
}

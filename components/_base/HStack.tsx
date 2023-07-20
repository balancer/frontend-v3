import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const variants = cva('flex flex-row', {
  variants: {
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    },
    spacing: {
      none: 'space-x-0',
      sm: 'space-x-2',
      md: 'space-x-4',
      lg: 'space-x-8',
    },
    padd: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    justify: 'start',
    align: 'start',
    spacing: 'none',
    padd: 'none',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  children?: ReactNode
}

export function HStack({
  children,
  justify,
  align,
  spacing,
  padd,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(variants({ justify, align, spacing, padd, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

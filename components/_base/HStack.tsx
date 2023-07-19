import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const hStackVariants = cva('flex flex-row', {
  variants: {
    align: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
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
    align: 'start',
    spacing: 'none',
    padd: 'none',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof hStackVariants> {
  children?: ReactNode
}

export function HStack({
  children,
  align,
  spacing,
  padd,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(hStackVariants({ align, spacing, padd, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

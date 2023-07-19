import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    },
    rows: {
      0: '',
      1: 'grid-rows-1',
      2: 'grid-rows-2',
      3: 'grid-rows-3',
      4: 'grid-rows-4',
      5: 'grid-rows-5',
      6: 'grid-rows-6',
      7: 'grid-rows-7',
      8: 'grid-rows-8',
      9: 'grid-rows-9',
      10: 'grid-rows-10',
      11: 'grid-rows-11',
      12: 'grid-rows-12',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-8',
    },
    padd: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    cols: 2,
    rows: 0,
    gap: 'md',
    padd: 'none',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  children?: ReactNode
}

export function Grid({
  children,
  cols,
  rows,
  gap,
  padd,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(gridVariants({ cols, rows, gap, padd, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

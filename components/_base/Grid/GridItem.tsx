import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const variants = cva('grid', {
  variants: {
    colSpan: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
    },
    rowSpan: {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
      4: 'row-span-4',
      5: 'row-span-5',
      6: 'row-span-6',
      7: 'row-span-7',
      8: 'row-span-8',
      9: 'row-span-9',
      10: 'row-span-10',
      11: 'row-span-11',
      12: 'row-span-12',
    },
    padd: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    colSpan: 1,
    rowSpan: 1,
    padd: 'none',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  children?: ReactNode
}

export function GridItem({
  children,
  colSpan,
  rowSpan,
  padd,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(variants({ colSpan, rowSpan, padd, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

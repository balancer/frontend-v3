import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const gridItemVariants = cva('grid', {
  variants: {
    span: {
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
    padd: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    span: 1,
    padd: 'none',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  children?: ReactNode
}

export function GridItem({ children, span, padd, className, ...props }: Props) {
  return (
    <div className={cn(gridItemVariants({ span, padd, className }))} {...props}>
      {children}
    </div>
  )
}

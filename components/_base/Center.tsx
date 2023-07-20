import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const variants = cva('flex items-center justify-center', {
  variants: {
    padd: {
      none: 'p-0',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    padd: 'none',
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  children: ReactNode
}

export function Center({ children, padd, className, ...props }: Props) {
  return (
    <div className={cn(variants({ padd, className }))} {...props}>
      {children}
    </div>
  )
}

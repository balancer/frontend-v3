import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const centerVariants = cva('flex items-center justify-center', {
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
    VariantProps<typeof centerVariants> {
  children: ReactNode
}

export function Center({ children, padd, className, ...props }: Props) {
  return (
    <div className={cn(centerVariants({ padd, className }))} {...props}>
      {children}
    </div>
  )
}

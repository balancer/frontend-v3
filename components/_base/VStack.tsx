import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'

const variants = cva('flex flex-col', {
  variants: {
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
    },
    spacing: {
      none: 'space-y-0',
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-8',
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
    VariantProps<typeof variants> {}

export function VStack({ align, spacing, padd, className, ...props }: Props) {
  return (
    <div
      className={cn(variants({ align, spacing, padd, className }))}
      {...props}
    />
  )
}

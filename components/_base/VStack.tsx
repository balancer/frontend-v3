import {
  alignItemsVariants,
  cn,
  heightVariants,
  justifyVariants,
  paddingVariants,
  widthVariants,
  ySpacingVariants,
} from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'

const variants = cva('flex flex-col', {
  variants: {
    justify: justifyVariants,
    align: alignItemsVariants,
    spacing: ySpacingVariants,
    padd: paddingVariants,
    height: heightVariants,
    width: widthVariants,
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {}

export function VStack({
  justify,
  align,
  spacing,
  padd,
  height,
  width,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        variants({ justify, align, spacing, padd, height, width, className })
      )}
      {...props}
    />
  )
}

import {
  alignItemsVariants,
  cn,
  justifyVariants,
  paddingVariants,
  widthVariants,
  xSpacingVariants,
} from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'

const variants = cva('flex flex-row', {
  variants: {
    justify: justifyVariants,
    align: alignItemsVariants,
    spacing: xSpacingVariants,
    padd: paddingVariants,
    height: widthVariants,
    width: widthVariants,
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {}

export function HStack({
  justify,
  align,
  spacing,
  padd,
  width,
  height,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        variants({ justify, align, spacing, padd, width, height, className })
      )}
      {...props}
    />
  )
}

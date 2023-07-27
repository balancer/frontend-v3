import {
  bgColorVariants,
  borderRadiusVariants,
  borderVariants,
  cn,
  heightVariants,
  marginVariants,
  overflowVariants,
  paddingVariants,
  widthVariants,
} from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'

const variants = cva('', {
  variants: {
    bg: bgColorVariants,
    padd: paddingVariants,
    margin: marginVariants,
    overflow: overflowVariants,
    border: borderVariants,
    borderRadius: borderRadiusVariants,
    width: widthVariants,
    height: heightVariants,
  },
})

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof variants> {
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main'
}

export function Box({
  as,
  bg,
  width,
  height,
  padd,
  margin,
  overflow,
  border,
  borderRadius,
  className,
  ...props
}: Props) {
  const Comp = as || 'div'
  return (
    <Comp
      className={cn(
        variants({
          bg,
          width,
          height,
          padd,
          margin,
          overflow,
          border,
          borderRadius,
          className,
        })
      )}
      {...props}
    />
  )
}

import {
  cn,
  fontFamilyVariants,
  fontItalicVariant,
  fontNumericVariants,
  fontyWeightVariants,
  lineHeightVariants,
  textAlignVariants,
  textColorVariants,
  textDecorationVariants,
  textOverflowVariants,
  textSizeVariants,
  wordBreakVariants,
} from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { ReactNode } from 'react'

const variants = cva('', {
  variants: {
    size: textSizeVariants,
    family: fontFamilyVariants,
    italic: fontItalicVariant,
    weight: fontyWeightVariants,
    numeric: fontNumericVariants,
    lineHeight: lineHeightVariants,
    align: textAlignVariants,
    textColor: textColorVariants,
    decoration: textDecorationVariants,
    overflow: textOverflowVariants,
    wordBreak: wordBreakVariants,
  },
})

interface Props
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof variants> {
  children?: ReactNode
}

export function Text({
  children,
  size,
  family,
  italic,
  weight,
  numeric,
  lineHeight,
  align,
  textColor,
  decoration,
  overflow,
  wordBreak,
  className,
  ...props
}: Props) {
  return (
    <p
      className={cn(
        variants({
          size,
          family,
          italic,
          weight,
          numeric,
          lineHeight,
          align,
          textColor,
          decoration,
          overflow,
          wordBreak,
          className,
        })
      )}
      {...props}
    >
      {children}
    </p>
  )
}

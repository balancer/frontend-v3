import { cn } from '@/lib/utils/styles'
import { VariantProps, cva } from 'class-variance-authority'
import { default as NextLink, LinkProps } from 'next/link'

const variants = cva('', {
  variants: {
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted',
      accent: 'text-accent',
      destructive: 'text-destructive',
    },
    underline: {
      true: 'underline',
    },
  },
  defaultVariants: {
    color: 'primary',
  },
})

interface Props extends LinkProps, VariantProps<typeof variants> {
  className?: string
  children?: React.ReactNode
  isExternal?: boolean
}

export function Link({
  color,
  underline,
  isExternal,
  className,
  ...props
}: Props) {
  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <NextLink
      className={cn(variants({ color, underline, className }))}
      {...externalProps}
      {...props}
    />
  )
}

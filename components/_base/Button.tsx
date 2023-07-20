/* eslint-disable max-len */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/styles'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-8 text-md',
      },
      shape: {
        default: '',
        circle: 'flex items-center justify-center rounded-full',
        square: 'flex items-center justify-center rounded-sm',
      },
    },
    compoundVariants: [
      {
        shape: ['square', 'circle'],
        size: 'xs',
        class: 'w-6 px-0',
      },
      {
        shape: ['square', 'circle'],
        size: 'sm',
        class: 'w-8 px-0',
      },
      {
        shape: ['square', 'circle'],
        size: 'md',
        class: 'w-10 px-0',
      },
      {
        shape: ['square', 'circle'],
        size: 'lg',
        class: 'w-12 px-0',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const iconVariants = cva('', {
  variants: {
    size: {
      xs: 'text-sm',
      sm: 'text-md',
      md: 'text-lg',
      lg: 'text-xl',
    },
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      leftIcon,
      rightIcon,
      className,
      variant,
      size,
      shape,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && (
          <span
            className={cn('mr-2', iconVariants({ size }))}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span
            className={cn('ml-2', iconVariants({ size }))}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

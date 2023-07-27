import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const twConfig = resolveConfig(tailwindConfig)

export const justifyVariants = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export const alignItemsVariants = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
}

export const ySpacingVariants = {
  none: 'space-y-0',
  sm: 'space-y-2',
  md: 'space-y-4',
  lg: 'space-y-8',
}

export const xSpacingVariants = {
  none: 'space-x-0',
  sm: 'space-x-2',
  md: 'space-x-4',
  lg: 'space-x-8',
}

export const paddingVariants = {
  none: 'p-0',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-8',
  xl: 'p-16',
}

export const marginVariants = {
  none: 'm-0',
  sm: 'm-2',
  md: 'm-4',
  lg: 'm-8',
  xl: 'm-16',
}

export const widthVariants = {
  full: 'w-full',
  auto: 'w-auto',
  '2': 'w-2',
  '4': 'w-4',
  '6': 'w-6',
  '8': 'w-8',
  '10': 'w-10',
  '12': 'w-12',
  '14': 'w-14',
  '16': 'w-16',
  '20': 'w-20',
  '24': 'w-24',
  '28': 'w-28',
  '32': 'w-32',
  '36': 'w-36',
  '40': 'w-40',
  '44': 'w-44',
  '48': 'w-48',
  '52': 'w-52',
  '56': 'w-56',
  '60': 'w-60',
  '64': 'w-64',
  '72': 'w-72',
  '80': 'w-80',
  '96': 'w-96',
  px: 'w-px',
}

export const heightVariants = {
  full: 'h-full',
  screen: 'h-screen',
  '2': 'h-2',
  '4': 'h-4',
  '6': 'h-6',
  '8': 'h-8',
  '10': 'h-10',
  '12': 'h-12',
  '14': 'h-14',
  '16': 'h-16',
  '20': 'h-20',
  '24': 'h-24',
  '28': 'h-28',
  '32': 'w-32',
  '36': 'h-36',
  '40': 'h-40',
  '44': 'h-44',
  '48': 'h-48',
  '52': 'h-52',
  '56': 'h-56',
  '60': 'h-60',
  '64': 'h-64',
  '72': 'h-72',
  '80': 'h-80',
  '96': 'h-96',
  px: 'h-px',
}

export const textSizeVariants = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
  '8xl': 'text-8xl',
  '9xl': 'text-9xl',
}

export const fontFamilyVariants = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
}

export const fontItalicVariant = {
  true: 'italic',
}

export const fontyWeightVariants = {
  thin: 'font-thin',
  extralight: 'font-extralight',
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
}

export const fontNumericVariants = {
  default: 'normal-nums',
  oldstyle: 'oldstyle-nums',
  lining: 'lining-nums',
  tabular: 'tabular-nums',
  proportional: 'proportional-nums',
  diagonal: 'diagonal-fractions',
  stacked: 'stacked-fractions',
  slashed: 'slashed-zero',
  ordinal: 'ordinal',
}

export const lineHeightVariants = {
  none: 'leading-none',
  tight: 'leading-tight',
  snug: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
}

export const textAlignVariants = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export const textColorVariants = {
  default: 'text-black',
  primary: 'text-blue-500',
  secondary: 'text-purple-500',
}

export const textDecorationVariants = {
  underline: 'underline',
  'line-through': 'line-through',
  'no-underline': 'no-underline',
  overline: 'overline',
}

export const textOverflowVariants = {
  ellipsis: 'overflow-ellipsis',
  clip: 'overflow-clip',
  truncate: 'truncate',
}

export const wordBreakVariants = {
  normal: 'break-normal',
  words: 'break-words',
  all: 'break-all',
  keep: 'break-keep',
}

export const borderRadiusVariants = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
}

export const borderVariants = {
  none: 'border-0',
  default: 'border border-border',
  primary: 'border border-primary',
  secondary: 'border border-secondary',
  muted: 'border border-muted',
  accent: 'border border-accent',
  destructive: 'border border-destructive',
}

export const overflowVariants = {
  hidden: 'overflow-hidden',
  visible: 'overflow-visible',
  scroll: 'overflow-scroll',
  auto: 'overflow-auto',
}

export const bgColorVariants = {
  default: 'bg-background text-background-foreground',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  muted: 'bg-muted text-muted-foreground',
  accent: 'bg-accent text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
}

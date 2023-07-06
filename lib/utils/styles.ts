import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const twConfig = resolveConfig(tailwindConfig)

'use client'

import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { createAvatar } from '@dicebear/core'
import { identicon } from '@dicebear/collection'
import { Address } from 'viem'
import { useTokens } from './useTokens'

type Props = {
  address?: Address | string
  chain?: GqlChain | number
  logoURI?: string | null
  fallbackSrc?: string
  alt: string
  size?: number
  border?: string
}

export function TokenIcon({
  address,
  chain,
  logoURI,
  alt,
  size = 36,
  border,
  ...rest
}: Props & Omit<ImageProps, 'src'>) {
  const [hasError, setHasError] = useState(false)
  const [iconSrc, setIconSrc] = useState<string | undefined>(undefined)

  const { getToken } = useTokens()
  const token = address && chain ? getToken(address, chain) : undefined

  const fallbackSVG = createAvatar(identicon, {
    seed: address || 'unknown',
  })

  function getIconSrc(): string | undefined {
    let src: string | undefined | null

    if (logoURI) {
      src = logoURI
    } else if (token) {
      src = token.logoURI
    }

    if (!src) return undefined

    try {
      new URL(src)
      return src
    } catch (error) {
      return undefined
    }
  }

  useEffect(() => {
    if (logoURI || token) {
      setIconSrc(getIconSrc())
    }
  }, [logoURI, JSON.stringify(token)])

  return (
    <Image
      src={hasError || !iconSrc ? fallbackSVG.toDataUriSync() : iconSrc}
      alt={alt}
      width={size}
      height={size}
      style={{
        borderRadius: '100%',
        border,
        backgroundColor: 'white',
        width: `${size}px`,
        height: `${size}px`,
      }}
      onError={() => !hasError && setHasError(true)}
      {...rest}
    />
  )
}

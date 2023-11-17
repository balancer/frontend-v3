import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { createAvatar } from '@dicebear/core'
import { identicon } from '@dicebear/collection'

type Props = {
  token: GqlToken
  fallbackSrc?: string
  alt: string
  size?: number
}

export function TokenIcon({ token, alt, size = 36, ...rest }: Props & Omit<ImageProps, 'src'>) {
  const [hasError, setHasError] = useState(false)

  const fallbackSVG = createAvatar(identicon, {
    seed: token.address,
  })

  function getIconSrc(): string | undefined {
    if (!token.logoURI) return undefined

    try {
      new URL(token.logoURI)
      return token.logoURI
    } catch (error) {
      return undefined
    }
  }

  const iconSrc = getIconSrc()

  return (
    <Image
      src={hasError || !iconSrc ? fallbackSVG.toDataUriSync() : iconSrc}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: '100%' }}
      onError={() => !hasError && setHasError(true)}
      {...rest}
    />
  )
}

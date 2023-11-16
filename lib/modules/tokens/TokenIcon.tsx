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

  return (
    <Image
      src={hasError || !token.logoURI ? fallbackSVG.toDataUriSync() : token.logoURI}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: '100%' }}
      onError={() => !hasError && setHasError(true)}
      {...rest}
    />
  )
}

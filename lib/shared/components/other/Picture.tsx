import React from 'react'

interface PictureProps {
  imgName: string
  altText: string
  defaultImgType: 'png' | 'jpg' | 'webp' | 'avif'
  imgAvif?: boolean
  imgWebp?: boolean
  imgPng?: boolean
  imgJpg?: boolean
  imgAvifPortrait?: boolean
  imgAvifDark?: boolean
  imgAvifMedium?: boolean
  imgAvifLarge?: boolean
  directory?: string
}

export const Picture: React.FC<PictureProps> = ({
  imgName,
  altText,
  defaultImgType,
  imgAvif = false,
  imgWebp = false,
  imgPng = false,
  imgJpg = false,
  imgAvifPortrait = false,
  imgAvifDark = false,
  imgAvifMedium = false,
  imgAvifLarge = false,
  directory = '/images/homepage/',
}) => {
  const imagePath = `${directory}${imgName}`

  return (
    <picture className="picture">
      {imgAvifDark && (
        <source
          srcSet={`${imagePath}-dark.avif`}
          type="image/avif"
          media="(prefers-color-scheme: dark)"
        />
      )}
      {imgAvifPortrait && (
        <source
          srcSet={`${imagePath}-portrait.avif`}
          type="image/avif"
          media="(orientation: portrait)"
        />
      )}
      {imgAvifLarge && (
        <source srcSet={`${imagePath}-large.avif`} type="image/avif" media="(min-width: 75em)" />
      )}
      {imgAvifMedium && (
        <source srcSet={`${imagePath}-medium.avif`} type="image/avif" media="(min-width: 40em)" />
      )}
      {imgAvif && <source srcSet={`${imagePath}.avif`} type="image/avif" />}
      {imgWebp && <source srcSet={`${imagePath}.webp`} type="image/webp" />}
      {imgPng && <source srcSet={`${imagePath}.png`} type="image/png" />}
      {imgJpg && <source srcSet={`${imagePath}.jpg`} type="image/jpg" />}
      <img
        src={`${imagePath}.${defaultImgType}`}
        alt={altText}
        loading="lazy"
        decoding="async"
        height="100%"
        style={{ objectFit: 'cover' }}
      />
    </picture>
  )
}

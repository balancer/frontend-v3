import { Box, Image } from '@chakra-ui/react'

export function PoolBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <Box w="full">
      <Image src={src} alt={alt} />
    </Box>
  )
}

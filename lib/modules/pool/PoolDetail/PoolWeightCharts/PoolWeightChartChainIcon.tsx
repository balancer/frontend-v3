import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import Image from 'next/image'

type Props = {
  chain: GqlChain
  isChartLoaded: boolean
}
export default function PoolWeightChartChainIcon({ chain, isChartLoaded }: Props) {
  return (
    <Box position="relative">
      <Box zIndex={4}>
        <Image
          src={`/images/chains/${chain}.svg`}
          alt={`Chain icon for ${chain.toLowerCase()}`}
          width={45}
          height={45}
        />
      </Box>

      <Box
        as={motion.div}
        background="white"
        borderRadius="full"
        position="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
        width="45px"
        height="45px"
        transform="scale(1.75)"
        initial={{ opacity: 0 }}
        animate={{ opacity: isChartLoaded ? 0.2 : 0, transition: { delay: 0.2 } }}
        zIndex={1}
      />
      <Box
        as={motion.div}
        background="white"
        borderRadius="full"
        position="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
        width="45px"
        height="45px"
        transform="scale(2.15)"
        initial={{ opacity: 0 }}
        animate={{ opacity: isChartLoaded ? 0.1 : 0, transition: { delay: 0.4 } }}
        zIndex={1}
      />
    </Box>
  )
}

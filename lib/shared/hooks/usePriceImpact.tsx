import { AlertTriangle, XOctagon } from 'react-feather'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { useMandatoryContext } from '../utils/contexts'
import { Icon } from '@chakra-ui/react'

type PriceImpactLevel = 'low' | 'medium' | 'high' | 'max' | 'unknown' | 'positive'

export function _usePriceImpact() {
  const [priceImpactLevel, setPriceImpactLevel] = useState<PriceImpactLevel>('low')
  const [priceImpactColor, setPriceImpactColor] = useState('green.400')
  const [acceptHighPriceImpact, setAcceptHighPriceImpact] = useState(false)
  const [priceImpact, setPriceImpact] = useState<string | number | undefined | null>()
  const [hasToAcceptHighPriceImpact, setHasToAcceptHighPriceImpact] = useState(false)

  function getPriceImpactLevel(priceImpact: number) {
    if (priceImpact === null || priceImpact === undefined) return 'unknown'
    if (priceImpact < 0) return 'positive'
    if (priceImpact >= 0 && priceImpact < 0.005) return 'low' // 0.5%
    if (priceImpact < 0.01) return 'medium' // 1%
    if (priceImpact < 0.05) return 'high' // 5%
    return 'max'
  }
  function getPriceImpactColor(priceImpactLevel: PriceImpactLevel) {
    switch (priceImpactLevel) {
      case 'unknown':
      case 'high':
      case 'max':
        return 'red.400'
      case 'positive':
        return 'green.400'
      case 'medium':
        return 'orange.300'
      case 'low':
      default:
        return 'grayText'
    }
  }

  function getPriceImpactIcon(priceImpactLevel: PriceImpactLevel) {
    switch (priceImpactLevel) {
      case 'unknown':
      case 'high':
      case 'max':
        return <Icon as={XOctagon} color={priceImpactColor} />
      case 'medium':
        return <Icon as={AlertTriangle} color={priceImpactColor} />
      case 'low':
      default:
        return undefined
    }
  }

  useEffect(() => {
    if (priceImpact) {
      const priceImpactValue = typeof priceImpact === 'string' ? Number(priceImpact) : priceImpact
      setPriceImpactLevel(getPriceImpactLevel(priceImpactValue))
      // reset accept high price impact when price impact changes
      setAcceptHighPriceImpact(false)
    } else {
      setPriceImpactLevel('low')
    }
  }, [priceImpact])

  useEffect(() => {
    setPriceImpactColor(getPriceImpactColor(priceImpactLevel))
  }, [priceImpactLevel])

  useEffect(() => {
    if (
      priceImpactLevel === 'high' ||
      priceImpactLevel === 'max' ||
      priceImpactLevel === 'unknown'
    ) {
      setHasToAcceptHighPriceImpact(true)
    } else {
      setHasToAcceptHighPriceImpact(false)
    }
  }, [priceImpactLevel])

  return {
    priceImpactLevel,
    priceImpactColor,
    setPriceImpactColor,
    acceptHighPriceImpact,
    setAcceptHighPriceImpact,
    getPriceImpactColor,
    getPriceImpactIcon,
    hasToAcceptHighPriceImpact,
    priceImpact,
    setPriceImpact,
  }
}

export type Result = ReturnType<typeof _usePriceImpact>
export const PriceImpactContext = createContext<Result | null>(null)

export function PriceImpactProvider({ children }: PropsWithChildren) {
  const priceImpact = _usePriceImpact()

  return <PriceImpactContext.Provider value={priceImpact}>{children}</PriceImpactContext.Provider>
}

export const usePriceImpact = (): Result => useMandatoryContext(PriceImpactContext, 'PriceImpact')

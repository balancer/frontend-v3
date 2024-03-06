import { TiWarning } from 'react-icons/ti'
import { TbAlertHexagonFilled } from 'react-icons/tb'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { useMandatoryContext } from '../utils/contexts'

type PriceImpactLevel = 'low' | 'medium' | 'high' | 'max'

export function _usePriceImpact() {
  const [priceImpactLevel, setPriceImpactLevel] = useState<PriceImpactLevel>('low')
  const [priceImpactColor, setPriceImpactColor] = useState('green.400')
  const [acceptHighPriceImpact, setAcceptHighPriceImpact] = useState(false)
  const [priceImpact, setPriceImpact] = useState<string | undefined>()
  const [hasToAcceptHighPriceImpact, setHasToAcceptHighPriceImpact] = useState(false)

  function getPriceImpactLevel(priceImpact: number) {
    if (priceImpact < 0.005) return 'low'
    if (priceImpact < 0.01) return 'medium'
    if (priceImpact < 0.05) return 'high'
    return 'max'
  }
  function getPriceImpactColor(priceImpactLevel: PriceImpactLevel) {
    switch (priceImpactLevel) {
      case 'high':
      case 'max':
        return 'red.400'
      case 'medium':
        return 'orange.300'
      case 'low':
      default:
        return 'green.400'
    }
  }

  function getPriceImpactIcon(priceImpactLevel: PriceImpactLevel) {
    switch (priceImpactLevel) {
      case 'high':
      case 'max':
        return <TbAlertHexagonFilled />
      case 'medium':
        return <TiWarning />
      case 'low':
      default:
        return undefined
    }
  }

  useEffect(() => {
    if (priceImpact) {
      setPriceImpactLevel(getPriceImpactLevel(parseFloat(priceImpact)))
    }
  }, [priceImpact])

  useEffect(() => {
    setPriceImpactColor(getPriceImpactColor(priceImpactLevel))
  }, [priceImpactLevel])

  useEffect(() => {
    if (priceImpactLevel === 'high' || priceImpactLevel === 'max') {
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

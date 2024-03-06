import { TiWarning } from 'react-icons/ti'
import { TbAlertHexagonFilled } from 'react-icons/tb'
import { useEffect, useState } from 'react'

type PriceImpactLevel = 'low' | 'medium' | 'high' | 'max'

export function usePriceImpact(priceImpact: string | undefined) {
  const [priceImpactLevel, setPriceImpactLevel] = useState<PriceImpactLevel>('low')
  const [priceImpactColor, setPriceImpactColor] = useState('green.400')
  const [acceptHighPriceImpact, setAcceptHighPriceImpact] = useState(false)

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

  const hasToAcceptHighPriceImpact = priceImpactLevel === 'high' || priceImpactLevel === 'max'

  console.log('hook', { hasToAcceptHighPriceImpact, acceptHighPriceImpact })

  return {
    priceImpactLevel,
    priceImpactColor,
    setPriceImpactColor,
    acceptHighPriceImpact,
    setAcceptHighPriceImpact,
    getPriceImpactColor,
    getPriceImpactIcon,
    hasToAcceptHighPriceImpact,
  }
}

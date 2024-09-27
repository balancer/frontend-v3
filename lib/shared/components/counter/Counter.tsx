import { useEffect, useRef } from 'react'
import { SpringOptions, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Text, TextProps } from '@chakra-ui/react'

/**
 * @see https://github.com/driaug/animated-counter
 */

interface Props extends TextProps {
  value: number
  direction?: 'up' | 'down'
  springOptions?: SpringOptions
  formatter: (value: number) => string
}

export function Counter({
  value,
  direction = 'up',
  springOptions = {
    stiffness: 190,
    damping: 115,
    mass: 1,
  },
  formatter,
  ...rest
}: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : 0)
  const springValue = useSpring(motionValue, springOptions)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === 'down' ? 0 : value)
    }
  }, [motionValue, isInView, value, direction])

  useEffect(
    () =>
      springValue.on('change', latest => {
        if (ref.current) {
          ref.current.textContent = formatter(latest)
        }
      }),
    [springValue, formatter]
  )

  return <Text ref={ref} {...rest} />
}

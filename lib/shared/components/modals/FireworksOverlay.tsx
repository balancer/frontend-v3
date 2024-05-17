import { ModalOverlay } from '@chakra-ui/react'
import Fireworks, { FireworksHandlers } from '@fireworks-js/react'
import { useEffect, useRef } from 'react'

export function FireworksOverlay({ startFireworks }: { startFireworks?: boolean }) {
  const ref = useRef<FireworksHandlers>(null)

  useEffect(() => {
    if (!ref.current) return
    if (startFireworks && ref.current) {
      ref.current.start()
    } else if (ref.current) {
      ref.current.stop()
    }
  }, [startFireworks])

  return (
    <ModalOverlay>
      <Fireworks
        ref={ref}
        options={{
          opacity: 1,
          acceleration: 1,
          explosion: 2,
          particles: 100,
          traceSpeed: 15,
          intensity: 50,
          rocketsPoint: { min: 0, max: 100 },
        }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
          background: 'transparent',
        }}
      />
    </ModalOverlay>
  )
}

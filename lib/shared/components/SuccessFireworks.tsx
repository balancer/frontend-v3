import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
import { useRef } from 'react'

export function SuccessFireworks() {
  const fireworksRef = useRef<FireworksHandlers>(null)
  return (
    <Fireworks
      ref={fireworksRef}
      options={{
        opacity: 1,
        hue: { min: 0, max: 360 },
        intensity: 60,
        flickering: 0,
        explosion: 10,
        particles: 200,
        traceSpeed: 1,
        sound: {
          enabled: true,
          files: ['/sounds/fireworks1.mp3', '/sounds/fireworks2.mp3', '/sounds/fireworks3.mp3'],
          volume: {
            min: 1,
            max: 4,
          },
        },
      }}
      style={{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        position: 'fixed',
        background: '#transparent',
      }}
    />
  )
}

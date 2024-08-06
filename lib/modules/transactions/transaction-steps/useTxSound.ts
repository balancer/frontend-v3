import useSound from 'use-sound'
import { StepType } from './lib'
import { usePathname } from 'next/navigation'

export function useTxSound() {
  const pathname = usePathname()

  const isCowTransaction = pathname.includes('/cow/')
  const successSoundSrc = isCowTransaction ? '/sounds/successMoo.mp3' : '/sounds/gong.mp3'
  const [playSuccessSound] = useSound(successSoundSrc)

  const removeSoundSrc = isCowTransaction ? '/sounds/errorMoo.mp3' : '/sounds/gong.mp3'
  const [playRemoveSound] = useSound(removeSoundSrc)

  const playTxSound = (stepType: StepType) =>
    stepType === 'removeLiquidity' ? playRemoveSound() : playSuccessSound()

  return { playTxSound }
}

import useSound from 'use-sound'
import { StepType } from './lib'

export function useTxSound() {
  const isCowTransaction = window.location.pathname.includes('cow')
  const successSoundSrc = isCowTransaction ? '/sounds/successMoo.mp3' : '/sounds/gong.mp3'
  const [playSuccessSound] = useSound(successSoundSrc)

  const removeSoundSrc = isCowTransaction ? '/sounds/errorMoo.mp3' : '/sounds/gong.mp3'
  const [playRemoveSound] = useSound(removeSoundSrc)

  function playTxSound(stepType: StepType) {
    if (stepType === 'removeLiquidity') return playRemoveSound()
    return playSuccessSound()
  }
  return { playTxSound }
}

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { lazily } from 'react-lazily'

export function Footer() {
  const { projectId } = getProjectConfig()
  const { FooterContent } = lazily(() => import(`./Footer.${projectId}`))

  return <FooterContent />
}

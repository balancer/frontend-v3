'use client'

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import dynamic from 'next/dynamic'

export function Footer() {
  const { projectId } = getProjectConfig()
  const FooterContent = dynamic(() =>
    import(`./Footer.${projectId}`).then(mod => mod.FooterContent)
  )

  return <FooterContent />
}

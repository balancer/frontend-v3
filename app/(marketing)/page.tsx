import { getProjectConfig } from '@/lib/config/getProjectConfig'
import dynamic from 'next/dynamic'

export default function Home() {
  const { projectId } = getProjectConfig()
  const HomeContent = dynamic(() =>
    import(`@/lib/shared/components/marketing/Home.${projectId}`).then(mod => mod.HomeContent)
  )

  return <HomeContent />
}

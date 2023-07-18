import PoolsList from '@/lib/modules/pools/PoolsList'

export default async function Home() {
  return (
    <main className="p-4">
      <PoolsList />
    </main>
  )
}

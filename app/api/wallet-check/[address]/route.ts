import { hours } from '@/lib/shared/hooks/useTime'

// Caches response from Hypernative for 12 hours *per address*.
export const revalidate = hours(12).toSecs()

const hypernativeApiKey = process.env.HYPERNATIVE_API_KEY

type Params = {
  params: {
    address: string
  }
}

type ReputationResponse = {
  data: Array<{ flags: string[]; address: string; recommendation: string }>
}

// Flags to ignore in check.
const IGNORED_FLAGS = ['F-1402', 'F-1412', 'F-3110']

export async function GET(request: Request, { params: { address } }: Params) {
  if (!hypernativeApiKey) return Response.json({ data: { isAuthorized: true } })

  try {
    const res = await fetch('https://api.hypernative.xyz/assets/reputation/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hypernativeApiKey}`,
      },
      body: JSON.stringify({
        addresses: [address],
      }),
    })

    const {
      data: [check],
    }: ReputationResponse = await res.json()

    const isAuthorized = check.flags.some(flag => !IGNORED_FLAGS.includes(flag))

    return Response.json({ data: { ...check, isAuthorized } })
  } catch (error) {
    return Response.json({ data: { isAuthorized: true } })
  }
}

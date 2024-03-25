import { hours } from '@/lib/shared/hooks/useTime'
import { NextResponse } from 'next/server'

type Params = {
  params: {
    address: string
  }
}

type ReputationResponse = {
  data: Array<{ flags: string[]; address: string; recommendation: string }>
}

async function getAuthKey(): Promise<string | null> {
  try {
    const res = await fetch('https://api.hypernative.xyz/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.HYPERNATIVE_EMAIL || '',
        password: process.env.HYPERNATIVE_PASSWORD || '',
      }),
      next: {
        revalidate: hours(12).toSecs(), // Token needs to be refetched every 24 hours. Set to 12 hours to be safe.
      },
    })
    const {
      data: { token },
    } = await res.json()

    return token
  } catch {
    return null
  }
}

export async function GET(request: Request, { params: { address } }: Params) {
  const apiKey = await getAuthKey()
  if (!apiKey) return NextResponse.json({ data: { isAuthorized: true } })

  try {
    const res = await fetch('https://api.hypernative.xyz/assets/reputation/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        addresses: [address],
        expandDetails: true,
      }),
      next: {
        revalidate: hours(12).toSecs(),
      },
    })

    const {
      data: [check],
    }: ReputationResponse = await res.json()

    const isAuthorized = check.recommendation !== 'Deny'

    return NextResponse.json({ data: { ...check, isAuthorized } })
  } catch (error) {
    return NextResponse.json({ data: { isAuthorized: true } })
  }
}

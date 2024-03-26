import { hours } from '@/lib/shared/hooks/useTime'
import { captureError, ensureError } from '@/lib/shared/utils/errors'
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
    // We don't want to send an error to Sentry here because in all environments
    // except production we will not have auth env vars set. However, we still
    // want to see if this is happening in production. We would have to check
    // Vercel logs for this.
    console.error('Failed to get Hypernative auth key')
    return null
  }
}

export async function GET(request: Request, { params: { address } }: Params) {
  try {
    const apiKey = await getAuthKey()
    if (!apiKey) return NextResponse.json({ isAuthorized: true })

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

    return NextResponse.json({ isAuthorized })
  } catch (err) {
    const error = ensureError(err)

    captureError(error, { extra: { address } })

    return NextResponse.json({ isAuthorized: true })
  }
}

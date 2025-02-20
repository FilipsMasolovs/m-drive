'use server'

import { cookies } from 'next/headers'

export default async function setForceRefreshCookie(key: string) {
  const c = await cookies()
  c.set(key, JSON.stringify(Math.random()))
}

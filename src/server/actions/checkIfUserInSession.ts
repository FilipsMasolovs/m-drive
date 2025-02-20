import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function checkIfUserInSession() {
  const session = await auth()
  if (!session.userId) {
    redirect('/')
  }
  return session
}

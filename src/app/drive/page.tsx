import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { MUTATIONS, QUERIES } from '~/server/db/queries'

export default async function DrivePage() {
  const session = await auth()

  if (!session.userId) {
    return redirect('/')
  }

  let rootFolderId = null

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId)

  if (!rootFolder) {
    rootFolderId = await MUTATIONS.onboardUser(session.userId)
  } else {
    rootFolderId = rootFolder.id
  }

  return redirect(`/m/${rootFolderId}`)
}

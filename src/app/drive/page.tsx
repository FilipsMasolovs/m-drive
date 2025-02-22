import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { MUTATIONS, QUERIES } from '~/server/db/queries'
import DriveRedirector from '~/components/drive/DriveRedirector/DriveRedirector'

export default async function DrivePage() {
  const session = await auth()
  if (!session.userId) {
    return redirect('/')
  }

  let rootFolderId: number | null = null
  const rootFolder = await QUERIES.getRootFolderForUser(session.userId)

  if (!rootFolder) {
    rootFolderId = await MUTATIONS.onboardUser(session.userId)
  } else {
    rootFolderId = rootFolder.id
  }

  return <DriveRedirector targetFolderId={rootFolderId} />
}

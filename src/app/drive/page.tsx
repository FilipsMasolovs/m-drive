import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { MUTATIONS, QUERIES } from '~/server/db/queries'

import styles from './page.module.css'

export default async function DrivePage() {
  const session = await auth()

  if (!session.userId) {
    return redirect('/')
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId)

  if (!rootFolder) {
    return (
      <div className={styles.pageContainer}>
        <form
          action={async () => {
            'use server'
            const session = await auth()

            if (!session.userId) {
              return redirect('/')
            }

            const rootFolderId = await MUTATIONS.onboardUser(session.userId)

            return redirect(`/f/${rootFolderId}`)
          }}
        >
          <button>Create new Drive</button>
        </form>
      </div>
    )
  }

  return redirect(`/m/${rootFolder.id}`)
}

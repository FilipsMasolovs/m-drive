import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DriveRedirector from '~/components/drive/DriveRedirector/DriveRedirector'
import { MUTATIONS, QUERIES } from '~/server/db/queries'

export default async function DrivePage() {
	const session = await auth()
	if (!session.userId) {
		return redirect('/')
	}

	const rootFolder = await QUERIES.getRootFolderForUser(session.userId) ?? { id: await MUTATIONS.onboardUser(session.userId) }

	return <DriveRedirector targetFolderId={rootFolder.id} />
}

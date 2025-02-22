import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import MDrive from '~/components/drive/MDrive/MDrive'
import { QUERIES } from '~/server/db/queries'
import { type DbFile, type DbFolder, type FileItem, type FolderItem } from '~/types/drive'

export default async function Home(props: { params: Promise<{ folderId: string }> }) {
	const params = await props.params
	const session = await auth()

	if (!session.userId) {
		return redirect('/')
	}

	const parsedFolderId = parseInt(params.folderId)

	if (isNaN(parsedFolderId)) {
		return <div>Invalid folder ID</div>
	}

	const [foldersData, filesData, parentsData, rootFolder, folder, allFiles] = await Promise.all([
		QUERIES.getFolders(parsedFolderId),
		QUERIES.getFiles(parsedFolderId),
		QUERIES.getAllParentsForFolder(parsedFolderId),
		QUERIES.getRootFolderForUser(session.userId),
		QUERIES.getFolderById(parsedFolderId),
		QUERIES.getAllFiles(session.userId),
	])

	if (!rootFolder || !folder) {
		return redirect('/drive')
	}

	if (session.userId !== folder.ownerId) {
		return redirect(`/m/${rootFolder.id}`)
	}

	const folders: FolderItem[] = (foldersData as DbFolder[]).map((folder) => ({
		id: folder.id,
		name: folder.name,
		type: 'folder',
		parent: folder.parent,
	}))

	const files: FileItem[] = (filesData as DbFile[]).map((file) => ({
		id: file.id,
		name: file.name,
		type: file.type,
		url: file.url,
		parent: file.parent,
		size: file.size,
	}))

	const parents: FolderItem[] = (parentsData as DbFolder[]).map((folder) => ({
		id: folder.id,
		name: folder.name,
		type: 'folder',
		parent: folder.parent,
	}))

	const capacityUsed = allFiles.reduce((acc, file) => acc + file.size, 0)

	return (
		<MDrive
			folders={folders}
			files={files}
			parents={parents}
			currentFolderId={parsedFolderId}
			rootFolderId={rootFolder.id}
			capacityUsed={capacityUsed}
			maxCapacity={134217728}
		/>
	)
}

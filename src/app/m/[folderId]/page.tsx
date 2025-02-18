import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import MDrive from '~/components/MDrive/MDrive'
import { QUERIES } from '~/server/db/queries'
import { type FolderItem, type FileItem } from '~/types/types'

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

  const folders: FolderItem[] = foldersData.map((folder) => ({
    ...folder,
    type: 'folder',
  }))

  const files: FileItem[] = filesData.map((file) => ({
    ...file,
    type: file.type,
  }))

  const parents: FolderItem[] = parentsData.map((folder) => ({
    ...folder,
    type: 'folder',
  }))

  const capacityUsed = allFiles.reduce((acc, file) => acc + file.size, 0)

  return <MDrive folders={folders} files={files} parents={parents} currentFolderId={parsedFolderId} rootFolderId={rootFolder.id} capacityUsed={capacityUsed} />
}

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import MDrive from '~/components/MDrive/MDrive'
import { QUERIES } from '~/server/db/queries'
import { type FolderItem, type FileItem, type FileType } from '~/types/types'

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

  const [foldersData, filesData, parentsData, rootFolder] = await Promise.all([
    QUERIES.getFolders(parsedFolderId),
    QUERIES.getFiles(parsedFolderId),
    QUERIES.getAllParentsForFolder(parsedFolderId),
    QUERIES.getRootFolderForUser(session.userId),
  ])

  if (!rootFolder) {
    return redirect('/drive')
  }

  const folders: FolderItem[] = foldersData.map((folder) => ({
    ...folder,
    type: 'folder',
  }))

  const files: FileItem[] = filesData.map((file) => ({
    ...file,
    type: file.type as FileType,
  }))

  const parents: FolderItem[] = parentsData.map((folder) => ({
    ...folder,
    type: 'folder',
  }))

  return <MDrive folders={folders} files={files} parents={parents} currentFolderId={parsedFolderId} rootFolderId={rootFolder.id} />
}

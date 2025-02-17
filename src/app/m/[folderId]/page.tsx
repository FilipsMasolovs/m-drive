import MDrive from '~/components/MDrive/MDrive'
import { getAllParentsForFolder, getFiles, getFolders } from '~/server/db/queries'
import { type FolderItem, type FileItem, type FileType } from '~/types/types'

export default async function Home(props: { params: Promise<{ folderId: string }> }) {
  const params = await props.params
  const parsedFolderId = parseInt(params.folderId)

  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>
  }

  const [foldersData, filesData, parentsData] = await Promise.all([getFolders(parsedFolderId), getFiles(parsedFolderId), getAllParentsForFolder(parsedFolderId)])

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

  return <MDrive folders={folders} files={files} parents={parents} />
}

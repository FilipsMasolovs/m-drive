import MDrive from '~/components/MDrive/MDrive'
import { db } from '~/server/db'
import { files as filesSchema, folders as foldersSchema } from '~/server/db/schema'
import type { FileItem, FolderItem, FileType } from '~/types/types'

export default async function Home() {
  const filesData = await db.select().from(filesSchema)
  const foldersData = await db.select().from(foldersSchema)

  const files: FileItem[] = filesData.map((file) => ({
    ...file,
    type: file.type as FileType,
  }))

  const folders: FolderItem[] = foldersData.map((folder) => ({
    ...folder,
    type: 'folder',
  }))

  return <MDrive files={files} folders={folders} />
}

import { eq } from 'drizzle-orm'
import MDrive from '~/components/MDrive/MDrive'
import { db } from '~/server/db'
import { files as filesSchema, folders as foldersSchema } from '~/server/db/schema'
import type { FileItem, FolderItem, FileType } from '~/types/types'

export default async function Home(props: { params: Promise<{ folderId: string }> }) {
  const params = await props.params
  const parsedFolderId = parseInt(params.folderId)

  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>
  }

  const filesData = await db.select().from(filesSchema).where(eq(filesSchema.parent, parsedFolderId))
  const allFoldersData = await db.select().from(foldersSchema).where(eq(foldersSchema.parent, parsedFolderId))

  const files: FileItem[] = filesData.map((file) => ({
    ...file,
    type: file.type as FileType,
  }))

  const folders: FolderItem[] = allFoldersData.map((folder) => ({
    ...folder,
    type: 'folder',
  }))

  return <MDrive folders={folders} files={files} initialFolderId={parsedFolderId} />
}

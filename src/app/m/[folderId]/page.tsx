import { eq } from 'drizzle-orm'
import MDrive from '~/components/MDrive/MDrive'
import { db } from '~/server/db'
import { files as filesSchema, folders as foldersSchema } from '~/server/db/schema'
import { type FolderItem, type FileItem, type FileType } from '~/types/types'

async function getAllParents(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null) {
    const folder = await db
      .selectDistinct()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, currentId));
    if (!folder[0]) {
      throw new Error("Parent folder not found");
    }
    parents.unshift(folder[0]);
    currentId = folder[0]?.parent;
  }
  parents.shift()
  return parents;
}

export default async function Home(props: { params: Promise<{ folderId: string }> }) {
  const params = await props.params
  const parsedFolderId = parseInt(params.folderId)

  if (isNaN(parsedFolderId)) {
    return <div>Invalid folder ID</div>
  }

  const foldersPromise = db.select().from(foldersSchema).where(eq(foldersSchema.parent, parsedFolderId))
  const filesPromise = db.select().from(filesSchema).where(eq(filesSchema.parent, parsedFolderId))
  const parentsPromise = getAllParents(parsedFolderId)

  const [foldersData, filesData, parentsData] = await Promise.all([foldersPromise, filesPromise, parentsPromise])

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

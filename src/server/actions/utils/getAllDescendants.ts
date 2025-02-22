'use server'

import { QUERIES } from '~/server/db/queries'
import { type DbFile, type DbFolder, type FileItem, type FolderItem } from '~/types/drive'

export async function getAllDescendantFolders(parentId: number): Promise<FolderItem[]> {
  const directFolders = (await QUERIES.getFolders(parentId)) as DbFolder[]
  let allFolders: FolderItem[] = directFolders.map((folder) => ({
    id: folder.id,
    name: folder.name,
    type: 'folder' as const,
    parent: folder.parent,
  }))
  for (const folder of directFolders) {
    const descendants = await getAllDescendantFolders(folder.id)
    allFolders = allFolders.concat(descendants)
  }
  return allFolders
}

export async function getAllDescendantFiles(parentId: number): Promise<FileItem[]> {
  const directFiles = (await QUERIES.getFiles(parentId)) as DbFile[]
  let allFiles: FileItem[] = directFiles.map((file) => ({
    id: file.id,
    name: file.name,
    type: file.type,
    url: file.url,
    parent: file.parent,
    size: file.size,
  }))
  const directFolders = await QUERIES.getFolders(parentId)
  for (const folder of directFolders) {
    const descendantFiles = await getAllDescendantFiles(folder.id)
    allFiles = allFiles.concat(descendantFiles)
  }
  return allFiles
}

'use server'

import { QUERIES } from '~/server/db/queries'

import type { FileItem, FolderItem } from '~/types/types'

export async function getAllDescendantFolders(parentId: number): Promise<FolderItem[]> {
  const directFolders = await QUERIES.getFolders(parentId)
  let allFolders: FolderItem[] = directFolders.map((folder) => ({
    ...folder,
    type: 'folder' as const,
  }))
  for (const folder of directFolders) {
    const descendants = await getAllDescendantFolders(folder.id)
    allFolders = allFolders.concat(descendants)
  }
  return allFolders
}

export async function getAllDescendantFiles(parentId: number): Promise<FileItem[]> {
  const directFiles = await QUERIES.getFiles(parentId)
  let allFiles: FileItem[] = [...directFiles]
  const directFolders = await QUERIES.getFolders(parentId)
  for (const folder of directFolders) {
    const descendantFiles = await getAllDescendantFiles(folder.id)
    allFiles = allFiles.concat(descendantFiles)
  }
  return allFiles
}

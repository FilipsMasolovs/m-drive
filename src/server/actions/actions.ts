'use server'

import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { files_table, folders_table } from '../db/schema'
import { auth } from '@clerk/nextjs/server'
import { UTApi } from 'uploadthing/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MUTATIONS, QUERIES } from '../db/queries'
import { type FileItem, type FolderItem } from '~/types/types'

const utApi = new UTApi()

export async function deleteFile(fileId: number) {
  const session = await auth()

  if (!session.userId) {
    return redirect('/')
  }

  const [file] = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)))

  if (!file) {
    return { error: 'File not found' }
  }

  await utApi.deleteFiles([file.url.replace('https://utfs.io/f/', '')])

  await db.delete(files_table).where(eq(files_table.id, fileId))

  const c = await cookies()

  c.set('force-refresh', JSON.stringify(Math.random()))

  return { success: true }
}

export async function createFolder(folderName: string, parentFolder: number) {
  const session = await auth()

  if (!session.userId) {
    return redirect('/')
  }

  await MUTATIONS.createFolder(folderName, parentFolder, session.userId)

  const c = await cookies()

  c.set('force-refresh', JSON.stringify(Math.random()))

  return { success: true }
}

export async function deleteFolder(folderId: number) {
  const session = await auth()

  if (!session.userId) {
    return redirect('/')
  }

  async function getAllDescendantFolders(parentId: number): Promise<FolderItem[]> {
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

  async function getAllDescendantFiles(parentId: number): Promise<FileItem[]> {
    const directFiles = await QUERIES.getFiles(parentId)
    let allFiles: FileItem[] = [...directFiles]
    const directFolders = await QUERIES.getFolders(parentId)
    for (const folder of directFolders) {
      const descendantFiles = await getAllDescendantFiles(folder.id)
      allFiles = allFiles.concat(descendantFiles)
    }
    return allFiles
  }

  const descendantFolders = await getAllDescendantFolders(folderId)
  const descendantFiles = await getAllDescendantFiles(folderId)

  await Promise.all(descendantFiles.map((file) => deleteFile(file.id)))
  await Promise.all(descendantFolders.map(async (folder) => await db.delete(folders_table).where(eq(folders_table.id, folder.id))))
  await db.delete(folders_table).where(eq(folders_table.id, folderId))

  const c = await cookies()

  c.set('force-refresh', JSON.stringify(Math.random()))

  return { success: true }
}

'use server'

import { and, eq } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'
import { UTApi } from 'uploadthing/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { db } from '~/server/db'
import { files_table, folders_table } from '~/server/db/schema'
import { MUTATIONS, QUERIES } from '~/server/db/queries'

import type { FileItem, FolderItem } from '~/types/types'

const utApi = new UTApi()

async function setForceRefreshCookie(key: string) {
  const c = await cookies()
  c.set(key, JSON.stringify(Math.random()))
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

export async function createFolder(folderName: string, parentFolder: number) {
  const session = await auth()

  if (!session.userId) return redirect('/')

  const allChildrenFolders = await QUERIES.getFolders(parentFolder)

  const duplicate = allChildrenFolders.find((folder) => folder.name.trim() === folderName.trim())

  if (duplicate) {
    throw new Error(`Folder "${folderName}" already exists.`)
  }

  await MUTATIONS.createFolder(folderName, parentFolder, session.userId)

  await setForceRefreshCookie('create-folder-force-refresh')

  return { success: true }
}

export async function deleteFolder(folderId: number) {
  const session = await auth()

  if (!session.userId) return redirect('/')

  const descendantFolders = await getAllDescendantFolders(folderId)

  const descendantFiles = await getAllDescendantFiles(folderId)

  await Promise.all(descendantFiles.map((file) => deleteFile(file.id)))

  await Promise.all(descendantFolders.map(async (folder) => await db.delete(folders_table).where(eq(folders_table.id, folder.id))))

  await db.delete(folders_table).where(eq(folders_table.id, folderId))

  await setForceRefreshCookie('delete-folder-force-refresh')

  return { success: true }
}

export async function deleteFile(fileId: number) {
  const session = await auth()

  if (!session.userId) return redirect('/')

  const [file] = await db
    .select()
    .from(files_table)
    .where(and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId)))

  if (!file) {
    return { error: 'File not found' }
  }

  await utApi.deleteFiles([file.url.replace('https://jb81yxad2w.ufs.sh/f/', '')])

  await db.delete(files_table).where(eq(files_table.id, fileId))

  await setForceRefreshCookie('delete-file-force-refresh')

  return { success: true }
}

export async function renameItem(itemId: number, newName: string) {
  const session = await auth()

  if (!session.userId) {
    return redirect('/')
  }

  const folderResult = await db
    .update(folders_table)
    .set({ name: newName })
    .where(and(eq(folders_table.id, itemId), eq(folders_table.ownerId, session.userId)))

  if (!(folderResult as any).affectedRows || (folderResult as any).affectedRows === 0) {
    await db
      .update(files_table)
      .set({ name: newName })
      .where(and(eq(files_table.id, itemId), eq(files_table.ownerId, session.userId)))
  }

  await setForceRefreshCookie('rename-item-force-refresh')

  return { success: true }
}

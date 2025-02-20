'use server'

import { auth } from '@clerk/nextjs/server'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { UTApi } from 'uploadthing/server'

import checkIfUserInSession from './checkIfUserInSession'
import { getAllDescendantFiles, getAllDescendantFolders } from './getAllDescendants'
import setForceRefreshCookie from './setForceRefreshCookie'

import { db } from '~/server/db'
import { files_table, folders_table } from '~/server/db/schema'
import { MUTATIONS, QUERIES } from '~/server/db/queries'

const utApi = new UTApi()

export default async function ACTIONS() {
  return {
    CREATIONS: {
      createFolder: async function (folderName: string, parentFolder: number) {
        const session = await checkIfUserInSession()

        const allChildrenFolders = await QUERIES.getFolders(parentFolder)

        const duplicate = allChildrenFolders.find((folder) => folder.name.trim() === folderName.trim())

        if (duplicate) {
          throw new Error(`Folder "${folderName}" already exists.`)
        }

        await MUTATIONS.createFolder(folderName, parentFolder, session.userId)

        await setForceRefreshCookie('create-folder-force-refresh')

        return { success: true }
      },
    },
    DELETIONS: {
      deleteFolder: async function (folderId: number) {
        await checkIfUserInSession()

        const descendantFolders = await getAllDescendantFolders(folderId)

        const descendantFiles = await getAllDescendantFiles(folderId)

        const actions = await ACTIONS()

        await Promise.all(descendantFiles.map((file) => actions.DELETIONS.deleteFile(file.id)))

        await Promise.all(descendantFolders.map(async (folder) => await db.delete(folders_table).where(eq(folders_table.id, folder.id))))

        await db.delete(folders_table).where(eq(folders_table.id, folderId))

        await setForceRefreshCookie('delete-folder-force-refresh')

        return { success: true }
      },
      deleteFile: async function (fileId: number) {
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
      },
    },
    MUTATIONS: {
      renameItem: async function (itemId: number, newName: string) {
        const session = await checkIfUserInSession()

        const folderResult = (await db
          .update(folders_table)
          .set({ name: newName })
          .where(and(eq(folders_table.id, itemId), eq(folders_table.ownerId, session.userId)))) as unknown

        interface UpdateResult {
          affectedRows?: number
          rowCount?: number
        }

        const result = folderResult as UpdateResult

        const affectedRows: number = result.affectedRows ?? result.rowCount ?? 0

        if (affectedRows === 0) {
          await db
            .update(files_table)
            .set({ name: newName })
            .where(and(eq(files_table.id, itemId), eq(files_table.ownerId, session.userId)))
        }

        await setForceRefreshCookie('rename-item-force-refresh')

        return { success: true }
      },
    },
  }
}

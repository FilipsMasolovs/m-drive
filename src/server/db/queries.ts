import 'server-only'

import { db } from '~/server/db'
import { files_table as filesSchema, folders_table as foldersSchema } from '~/server/db/schema'
import { eq, and, isNull, like } from 'drizzle-orm'

export const QUERIES = {
  getFolders: function (folderId: number) {
    return db.select().from(foldersSchema).where(eq(foldersSchema.parent, folderId)).orderBy(foldersSchema.id)
  },
  getFiles: function (folderId: number) {
    return db.select().from(filesSchema).where(eq(filesSchema.parent, folderId)).orderBy(filesSchema.id)
  },
  getAllParentsForFolder: async function (folderId: number) {
    const parents = []
    let currentId: number | null = folderId
    while (currentId !== null) {
      const folder = await db.selectDistinct().from(foldersSchema).where(eq(foldersSchema.id, currentId))
      if (!folder[0]) {
        throw new Error('Parent folder not found')
      }
      parents.unshift(folder[0])
      currentId = folder[0]?.parent
    }
    parents.shift()
    return parents
  },
  getFolderById: async function (folderId: number) {
    const folder = await db.select().from(foldersSchema).where(eq(foldersSchema.id, folderId))
    return folder[0]
  },
  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(and(eq(foldersSchema.ownerId, userId), isNull(foldersSchema.parent)))
    return folder[0]
  },
  getAllFiles: function (userId: string) {
    return db.select().from(filesSchema).where(eq(filesSchema.ownerId, userId))
  },
  searchFilesAndFolders: async function (userId: string, searchTerm: string) {
    const folders = await db
      .select()
      .from(foldersSchema)
      .where(and(eq(foldersSchema.ownerId, userId), like(foldersSchema.name, `%${searchTerm}%`)))
      .orderBy(foldersSchema.id)

    const files = await db
      .select()
      .from(filesSchema)
      .where(and(eq(filesSchema.ownerId, userId), like(filesSchema.name, `%${searchTerm}%`)))
      .orderBy(filesSchema.id)

    return { folders, files }
  },
}

export const MUTATIONS = {
  createFile: async function (input: { file: { name: string; type: string; url: string; parent: number; size: number }; userId: string }) {
    return await db.insert(filesSchema).values({ ...input.file, ownerId: input.userId })
  },
  createFolder: async function (folderName: string, parentFolder: number, userId: string) {
    return await db.insert(foldersSchema).values({ name: folderName, type: 'folder', parent: parentFolder, ownerId: userId })
  },
  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(foldersSchema)
      .values({
        name: 'Root',
        type: 'folder',
        parent: null,
        ownerId: userId,
      })
      .$returningId()

    const rootFolderId = rootFolder[0]!.id

    await db.insert(foldersSchema).values([
      {
        name: 'Pictures',
        type: 'folder',
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: 'Videos',
        type: 'folder',
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: 'Other',
        type: 'folder',
        parent: rootFolderId,
        ownerId: userId,
      },
    ])

    return rootFolderId
  },
}

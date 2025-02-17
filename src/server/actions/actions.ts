'use server'

import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { files_table } from '../db/schema'
import { auth } from '@clerk/nextjs/server'
import { UTApi } from 'uploadthing/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MUTATIONS } from '../db/queries'

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

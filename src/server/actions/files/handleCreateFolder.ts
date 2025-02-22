'use server'

import ACTIONS from '~/server/actions/actions'

export async function handleCreateFolder(folderName: string, currentFolderId: number): Promise<void> {
  if (!folderName.trim()) {
    return
  }

  try {
    const actions = await ACTIONS()
    await actions.CREATIONS.createFolder(folderName, currentFolderId)
  } catch (error) {
    console.error('Error creating folder:', error)
  }
}
